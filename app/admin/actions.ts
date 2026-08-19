'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { getExpectedAdminToken, verifyAdminSession } from '@/lib/auth';
import { fetchSocialMetadata } from '@/lib/social-oembed';

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

function isLiveSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo-project') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
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
  const password = formData.get('password') as string;
  const expectedPassword = process.env.ADMIN_PASSWORD || 'ruru2026';
  const cookieStore = await cookies();

  if (!password || password !== expectedPassword) {
    // Brute-force bot saldırılarını yavaşlatmak için gecikme
    await new Promise((r) => setTimeout(r, 450));
    throw new Error('Girdiğiniz atölye şifresi hatalı.');
  }

  const token = await getExpectedAdminToken();

  cookieStore.set('ruru_admin_session', token, {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return { success: true };
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      await supabase.auth.signOut();
    } catch {}
  }
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
  } catch (e) {
    gallery_urls = [];
  }

  let craft_details = [];
  try {
    if (craft_details_raw) craft_details = JSON.parse(craft_details_raw);
  } catch (e) {
    craft_details = [];
  }

  const slug = generateSlug(title);

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.from('pieces').insert([
        {
          title,
          slug,
          category,
          story,
          main_image_url,
          gallery_urls,
          craft_details,
          size_info,
          measurements,
          showcase_section,
          is_shopier_product: is_shopier,
          shopier_sku,
          shopier_url,
          price,
          is_archived: showcase_section === 'archive',
          order_index: 1,
        },
      ]);

      if (error) {
        console.error('Supabase piece insert error:', error);
      }
    } catch (err) {
      console.error('Database piece insert exception:', err);
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
  } catch (e) {
    gallery_urls = [];
  }

  let craft_details = [];
  try {
    if (craft_details_raw) craft_details = JSON.parse(craft_details_raw);
  } catch (e) {
    craft_details = [];
  }

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase
        .from('pieces')
        .update({
          title,
          category,
          story,
          main_image_url,
          gallery_urls,
          craft_details,
          size_info,
          measurements,
          showcase_section,
          is_shopier_product: is_shopier,
          shopier_sku,
          shopier_url,
          price,
          is_archived,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Supabase piece update error:', error);
      }
    } catch (err) {
      console.error('Database piece update exception:', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/parca/[slug]', 'page');
  revalidatePath('/admin/pieces');
  revalidatePath('/admin');
}

export async function deletePieceAction(id: string) {
  await requireAdminAuth();

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      await supabase.from('pieces').delete().eq('id', id);
    } catch (err) {
      console.error('Database piece delete exception:', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/parca/[slug]', 'page');
  revalidatePath('/admin/pieces');
  revalidatePath('/admin');
}

export async function togglePieceArchiveAction(id: string, currentStatus: boolean) {
  await requireAdminAuth();

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      await supabase
        .from('pieces')
        .update({ is_archived: !currentStatus })
        .eq('id', id);
    } catch (err) {
      console.error('Database piece toggle archive exception:', err);
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
  } catch (e) {
    photo_urls = [];
  }

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      await supabase.from('journal_notes').insert([
        {
          title,
          quote,
          content,
          photo_urls,
          is_published: true,
          published_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error('Database journal insert exception:', err);
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
  } catch (e) {
    photo_urls = [];
  }

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      await supabase
        .from('journal_notes')
        .update({
          title,
          quote,
          content,
          photo_urls,
        })
        .eq('id', id);
    } catch (err) {
      console.error('Database journal update exception:', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/gunluk');
  revalidatePath('/admin/journal');
  revalidatePath('/admin');
}

export async function deleteJournalNoteAction(id: string) {
  await requireAdminAuth();

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      await supabase.from('journal_notes').delete().eq('id', id);
    } catch (err) {
      console.error('Database journal delete exception:', err);
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

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      await supabase.from('social_embeds').insert([
        {
          platform,
          url,
          caption,
          thumbnail_url,
          order_index: 1,
        },
      ]);
    } catch (err) {
      console.error('Database social insert exception:', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin/social');
  revalidatePath('/admin');
}

export async function deleteSocialEmbedAction(id: string) {
  await requireAdminAuth();

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerClient();
      await supabase.from('social_embeds').delete().eq('id', id);
    } catch (err) {
      console.error('Database social delete exception:', err);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin/social');
  revalidatePath('/admin');
}
