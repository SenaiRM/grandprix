import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  const url = new URL('/admin/login', req.url);
  const res = NextResponse.redirect(url);
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return res;
}
