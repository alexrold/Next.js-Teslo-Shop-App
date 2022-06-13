import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session) {
    const { origin, pathname } = req.nextUrl.clone();
    return NextResponse.redirect(`${origin}/auth/login?origin=${pathname}`);
  }
  const validRole = ['admin'].includes(session.user.role);
  const { origin } = req.nextUrl.clone();

  return validRole ? NextResponse.next() : NextResponse.redirect(`${origin}`);
}