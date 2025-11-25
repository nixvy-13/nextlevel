import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    envKeys: Object.keys(process.env),
    hasClerkSecret: !!process.env.CLERK_SECRET_KEY,
    hasClerkPublishable: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    nodeEnv: process.env.NODE_ENV,
  });
}

