import { getValueMemoized, RequestContext } from "@/utils";
import { NextResponse } from "next/server";

export async function GET() {
  RequestContext.enterWith('route')
  const value = await getValueMemoized();
  return NextResponse.json({ value }, { status: 200 });
}
