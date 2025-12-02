import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({}, { status: 204 });
  res.cookies.set('token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}


