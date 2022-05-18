import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { jwt } from '../../utils';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { token } = req.cookies;

  try {
    await jwt.validateToken(token);
    return NextResponse.next();
  } catch (error) {
    const { origin, pathname } = req.nextUrl.clone();
    return NextResponse.redirect(`${origin}/auth/login?origin=${pathname}`);
  }
}