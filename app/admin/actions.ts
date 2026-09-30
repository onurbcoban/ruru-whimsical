'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import {
  createAdminToken,
  verifyAdminSession,
  getCurrentAdmin,
} from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/password';
import { fetchSocialMetadata } from '@/lib/social-oembed';
import { setInMemoryHeroSettings } from '@/lib/queries';
import sql from '@/lib/db';

function generateSlug(text: string): string {
  const trMap: { [key: string]: string } = {
    ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i',
    ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
  };
  return text
    .split('')
    .map((char) => trMap[char] || char)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-');
}

async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('ruru_admin_session')?.value;
  const isValid = await verifyAdminSession(token);
  if (!isValid) {
    throw new Error('Yetkisiz işlem. Lütfen giriş yapın.');
  }
}

export async function loginAdminAction(formData: FormData) {
  const email = (formData.get('email') as string || '').toLowerCase().trim();
  const password = formData.get('password') as string;
  const cookieStore = await cookies();

  if (!email || !password) {
    throw new Error('Lütfen e-posta ve şifrenizi girin.');
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('Veritabanı bağlantısı yapılandırılmamış.');
  }

  const rows = await sql`
    SELECT id, email, name, password_hash, salt
    FROM public.admin_users
    WHERE LOWER(email) = ${email}
    LIMIT 1
  `;

  if (rows.length === 0) {
    await new Promise((r) => setTimeout(r, 450));
    throw new Error('Girdiğiniz e-posta veya şifre hatalı.');
  }

  const user = rows[0];
  const isMatch = await verifyPassword(password, user.password_hash, user.salt);

  if (!isMatch) {
    await new Promise((r) => setTimeout(r, 450));
    throw new Error('Girdiğiniz e-posta veya şifre hatalı.');
  }

  const token = await createAdminToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  cookieStore.set('ruru_admin_session', token, {
    maxAge: 60 * 60 * 24 * 7, // 7 gun
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return { success: true };
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete('ruru_admin_session');
}

export async function createPieceAction(formData: FormData) {
  await requireAdminAuth();

  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const story = (formData.get('story') as string) || '';
  const main_image_url = formData.get('main_image_url') as string;
  const gallery_urls_raw = formData.get('gallery_urls') as string;
  const showcase_section = (formData.get('showcase_section') as string) || 'shopier';
  const is_shopier = showcase_section === 'shopier' || formData.get('is_shopier_product') === 'true';
  const shopier_sku = (formData.get('shopier_sku') as string) || null;
  const shopier_url = (formData.get('shopier_url') as string) || null;
  const price = formData.get('price') ? Number(formData.get('price')) : null;
  const size_info = (formData.get('size_info') as string) || null;
  const measurements = (formData.get('measurements') as string) || null;
  const craft_details_raw = formData.get('craft_details') as string;

  let gallery_urls: string[] = [];
  try {
    if (gallery_urls_raw) gallery_urls = JSON.parse(gallery_urls_raw);
  } catch {
    gallery_urls = [];
  }

  let craft_details = [];
  try {
    if (craft_details_raw) craft_details = JSON.parse(craft_details_raw);
  } catch {
    craft_details = [];
  }

  let slug = generateSlug(title);
  if (!slug) slug = 'parca-' + Date.now();

  if (process.env.DATABASE_URL) {
    try {
      const existing = await sql`SELECT id FROM public.pieces WHERE slug = ${slug} LIMIT 1`;
      if (existing.length > 0) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      await sql`
        INSERT INTO public.pieces (
          title, slug, category, story, main_image_url, gallery_urls,
          craft_details, size_info, measurements, showcase_section,
          is_shopier_product, shopier_sku, shopier_url, price,
          is_archived, order_index
        ) VALUES (
          ${title}, ${slug}, ${category}, ${story}, ${main_image_url}, ${gallery_urls},
          ${JSON.stringify(craft_details)}::jsonb, ${size_info}, ${measurements}, ${showcase_section},
          ${is_shopier}, ${shopier_sku}, ${shopier_url}, ${price},
          ${showcase_section === 'archive'}, 1
        )
      `;
    } catch (err) {
      console.error('Database piece insert exception (PostgreSQL):', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/parca/[slug]', 'page');
  revalidatePath('/admin/pieces');
  revalidatePath('/admin');
}

export async function updatePieceAction(id: string, formData: FormData) {
  await requireAdminAuth();

  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const story = (formData.get('story') as string) || '';
  const main_image_url = formData.get('main_image_url') as string;
  const gallery_urls_raw = formData.get('gallery_urls') as string;
  const showcase_section = (formData.get('showcase_section') as string) || 'shopier';
  const is_shopier = showcase_section === 'shopier' || formData.get('is_shopier_product') === 'true';
  const shopier_sku = (formData.get('shopier_sku') as string) || null;
  const shopier_url = (formData.get('shopier_url') as string) || null;
  const price = formData.get('price') ? Number(formData.get('price')) : null;
  const size_info = (formData.get('size_info') as string) || null;
  const measurements = (formData.get('measurements') as string) || null;
  const is_archived = showcase_section === 'archive' || formData.get('is_archived') === 'true';
  const craft_details_raw = formData.get('craft_details') as string;

  let gallery_urls: string[] = [];
  try {
    if (gallery_urls_raw) gallery_urls = JSON.parse(gallery_urls_raw);
  } catch {
    gallery_urls = [];
  }

  let craft_details = [];
  try {
    if (craft_details_raw) craft_details = JSON.parse(craft_details_raw);
  } catch {
    craft_details = [];
  }

  if (process.env.DATABASE_URL) {
    try {
      await sql`
        UPDATE public.pieces SET
          title = ${title},
          category = ${category},
          story = ${story},
          main_image_url = ${main_image_url},
          gallery_urls = ${gallery_urls},
          craft_details = ${JSON.stringify(craft_details)}::jsonb,
          size_info = ${size_info},
          measurements = ${measurements},
          showcase_section = ${showcase_section},
          is_shopier_product = ${is_shopier},
          shopier_sku = ${shopier_sku},
          shopier_url = ${shopier_url},
          price = ${price},
          is_archived = ${is_archived},
          updated_at = NOW()
        WHERE id = ${id}
      `;
    } catch (err) {
      console.error('Database piece update exception (PostgreSQL):', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/parca/[slug]', 'page');
  revalidatePath('/admin/pieces');
  revalidatePath('/admin');
}

export async function deletePieceAction(id: string) {
  await requireAdminAuth();

  if (process.env.DATABASE_URL) {
    try {
      await sql`DELETE FROM public.pieces WHERE id = ${id}`;
    } catch (err) {
      console.error('Database piece delete exception (PostgreSQL):', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/parca/[slug]', 'page');
  revalidatePath('/admin/pieces');
  revalidatePath('/admin');
}

export async function togglePieceArchiveAction(id: string, currentStatus: boolean) {
  await requireAdminAuth();

  if (process.env.DATABASE_URL) {
    try {
      await sql`
        UPDATE public.pieces
        SET is_archived = ${!currentStatus}, updated_at = NOW()
        WHERE id = ${id}
      `;
    } catch (err) {
      console.error('Database piece toggle archive exception (PostgreSQL):', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin/pieces');
  revalidatePath('/admin');
}

export async function saveJournalNoteAction(formData: FormData) {
  await requireAdminAuth();

  const title = formData.get('title') as string;
  const quote = (formData.get('quote') as string) || null;
  const content = (formData.get('content') as string) || null;
  const photo_urls_raw = formData.get('photo_urls') as string;

  let photo_urls: string[] = [];
  try {
    if (photo_urls_raw) photo_urls = JSON.parse(photo_urls_raw);
  } catch {
    photo_urls = [];
  }

  if (process.env.DATABASE_URL) {
    try {
      await sql`
        INSERT INTO public.journal_notes (
          title, quote, content, photo_urls, is_published, published_at
        ) VALUES (
          ${title}, ${quote}, ${content}, ${photo_urls}, true, NOW()
        )
      `;
    } catch (err) {
      console.error('Database journal insert exception (PostgreSQL):', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/gunluk');
  revalidatePath('/admin/journal');
  revalidatePath('/admin');
}

export async function updateJournalNoteAction(id: string, formData: FormData) {
  await requireAdminAuth();

  const title = formData.get('title') as string;
  const quote = (formData.get('quote') as string) || null;
  const content = (formData.get('content') as string) || null;
  const photo_urls_raw = formData.get('photo_urls') as string;

  let photo_urls: string[] = [];
  try {
    if (photo_urls_raw) photo_urls = JSON.parse(photo_urls_raw);
  } catch {
    photo_urls = [];
  }

  if (process.env.DATABASE_URL) {
    try {
      await sql`
        UPDATE public.journal_notes SET
          title = ${title},
          quote = ${quote},
          content = ${content},
          photo_urls = ${photo_urls}
        WHERE id = ${id}
      `;
    } catch (err) {
      console.error('Database journal update exception (PostgreSQL):', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/gunluk');
  revalidatePath('/admin/journal');
  revalidatePath('/admin');
}

export async function deleteJournalNoteAction(id: string) {
  await requireAdminAuth();

  if (process.env.DATABASE_URL) {
    try {
      await sql`DELETE FROM public.journal_notes WHERE id = ${id}`;
    } catch (err) {
      console.error('Database journal delete exception (PostgreSQL):', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/gunluk');
  revalidatePath('/admin/journal');
  revalidatePath('/admin');
}

export async function createSocialEmbedAction(formData: FormData) {
  await requireAdminAuth();

  const url = formData.get('url') as string;
  const manualCaption = (formData.get('caption') as string) || '';

  if (!url) {
    throw new Error('Lütfen geçerli bir Instagram veya TikTok linki girin.');
  }

  const { platform, thumbnail_url, caption } = await fetchSocialMetadata(url, manualCaption);

  if (process.env.DATABASE_URL) {
    try {
      await sql`
        INSERT INTO public.social_embeds (
          platform, url, caption, thumbnail_url, order_index
        ) VALUES (
          ${platform}, ${url}, ${caption}, ${thumbnail_url}, 1
        )
      `;
    } catch (err) {
      console.error('Database social insert exception (PostgreSQL):', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin/social');
  revalidatePath('/admin');
}

export async function deleteSocialEmbedAction(id: string) {
  await requireAdminAuth();

  if (process.env.DATABASE_URL) {
    try {
      await sql`DELETE FROM public.social_embeds WHERE id = ${id}`;
    } catch (err) {
      console.error('Database social delete exception (PostgreSQL):', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin/social');
  revalidatePath('/admin');
}

export async function updateHeroSettingsAction(formData: FormData) {
  await requireAdminAuth();

  const title = (formData.get('title') as string) || '';
  const highlight = (formData.get('highlight') as string) || '';
  const title_suffix = (formData.get('title_suffix') as string) || '';
  const description = (formData.get('description') as string) || '';
  const handwritten_note = (formData.get('handwritten_note') as string) || '';

  const heroData = {
    title,
    highlight,
    title_suffix,
    description,
    handwritten_note,
  };

  setInMemoryHeroSettings(heroData);

  if (process.env.DATABASE_URL) {
    try {
      await sql`
        INSERT INTO public.site_settings (key, value, updated_at)
        VALUES ('hero', ${JSON.stringify(heroData)}::jsonb, NOW())
        ON CONFLICT (key) DO UPDATE
        SET value = EXCLUDED.value, updated_at = NOW()
      `;
    } catch (err) {
      console.error('Database hero update exception (PostgreSQL):', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function changePasswordAction(formData: FormData) {
  await requireAdminAuth();
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    throw new Error('Yetkisiz işlem.');
  }

  const currentPassword = formData.get('current_password') as string;
  const newPassword = formData.get('new_password') as string;
  const newPasswordConfirm = formData.get('new_password_confirm') as string;

  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    throw new Error('Lütfen tüm şifre alanlarını doldurun.');
  }

  if (newPassword.length < 6) {
    throw new Error('Yeni şifre en az 6 karakter olmalıdır.');
  }

  if (newPassword !== newPasswordConfirm) {
    throw new Error('Yeni şifreler birbiriyle uyuşmuyor.');
  }

  if (process.env.DATABASE_URL) {
    const rows = await sql`
      SELECT id, password_hash, salt
      FROM public.admin_users
      WHERE id = ${currentAdmin.sub}
      LIMIT 1
    `;

    if (rows.length === 0) {
      throw new Error('Kullanıcı bulunamadı.');
    }

    const isMatch = await verifyPassword(currentPassword, rows[0].password_hash, rows[0].salt);
    if (!isMatch) {
      throw new Error('Mevcut şifrenizi hatalı girdiniz.');
    }

    const { hash, salt } = await hashPassword(newPassword);
    await sql`
      UPDATE public.admin_users
      SET password_hash = ${hash}, salt = ${salt}, updated_at = NOW()
      WHERE id = ${currentAdmin.sub}
    `;
  }

  return { success: true };
}

export async function createAdminUserAction(formData: FormData) {
  await requireAdminAuth();

  const name = (formData.get('name') as string || '').trim();
  const email = (formData.get('email') as string || '').toLowerCase().trim();
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    throw new Error('Lütfen ad, e-posta ve şifre alanlarını eksiksiz doldurun.');
  }

  if (!email.includes('@')) {
    throw new Error('Lütfen geçerli bir e-posta adresi girin.');
  }

  if (password.length < 6) {
    throw new Error('Şifre en az 6 karakter olmalıdır.');
  }

  if (process.env.DATABASE_URL) {
    const existing = await sql`
      SELECT id FROM public.admin_users
      WHERE LOWER(email) = ${email}
      LIMIT 1
    `;
    if (existing.length > 0) {
      throw new Error('Bu e-posta adresiyle kayıtlı bir yönetici zaten mevcut.');
    }

    const { hash, salt } = await hashPassword(password);
    await sql`
      INSERT INTO public.admin_users (name, email, password_hash, salt)
      VALUES (${name}, ${email}, ${hash}, ${salt})
    `;
  }

  revalidatePath('/admin/users');
  return { success: true };
}

export async function deleteAdminUserAction(targetUserId: string) {
  await requireAdminAuth();
  const currentAdmin = await getCurrentAdmin();

  if (currentAdmin?.sub === targetUserId) {
    throw new Error('Kendi yönetici hesabınızı silemezsiniz.');
  }

  if (process.env.DATABASE_URL) {
    const allAdmins = await sql`SELECT id FROM public.admin_users`;
    if (allAdmins.length <= 1) {
      throw new Error('Sistemde en az 1 yönetici hesabı kalmalıdır.');
    }

    await sql`DELETE FROM public.admin_users WHERE id = ${targetUserId}`;
  }

  revalidatePath('/admin/users');
  return { success: true };
}

