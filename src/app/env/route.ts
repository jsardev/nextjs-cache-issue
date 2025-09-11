import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    env: process.env.VERCEL_ENV,
    targetEnv: process.env.VERCEL_TARGET_ENV,
  });
}
