import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-me');
export const COOKIE_NAME = 'admin_session';

export async function createSession(): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function requireAuthApi(): Promise<NextResponse | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const valid = await verifySession(token);
  if (!valid) return NextResponse.json({ error: 'Sessão expirada' }, { status: 401 });
  return null;
}

export async function requireAuthPage(): Promise<void> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) redirect('/admin/login');
  const valid = await verifySession(token);
  if (!valid) redirect('/admin/login');
}
