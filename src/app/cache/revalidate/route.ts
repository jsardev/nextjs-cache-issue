import { RequestContext, revalidateGetValue } from "@/utils";
import { NextResponse } from "next/server";

export async function GET() {
  RequestContext.enterWith('route')
  await revalidateGetValue();
  return NextResponse.json({}, { status: 200 });
}
