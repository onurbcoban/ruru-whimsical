export async function getExpectedAdminToken(): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD || 'ruru2026';
  const msgBuffer = new TextEncoder().encode(`ruru-whimsical-salt-${secret}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminSession(cookieValue?: string | null): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await getExpectedAdminToken();

  if (cookieValue.length !== expected.length) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= cookieValue.charCodeAt(i) ^ expected.charCodeAt(i);
  }

  return mismatch === 0;
}
