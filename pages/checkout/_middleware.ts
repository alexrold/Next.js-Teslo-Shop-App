import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';



export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session) {
    const { origin, pathname } = req.nextUrl.clone();
    return NextResponse.redirect(`${origin}/auth/login?origin=${pathname}`);
  }
  return NextResponse.next();



  // const { token } = req.cookies;
  // try {
  //   await jwt.validateToken(token);
  //   return NextResponse.next();
  // } catch (error) {
  //   const { origin, pathname } = req.nextUrl.clone();
  //   return NextResponse.redirect(`${origin}/auth/login?origin=${pathname}`);
  // }
}