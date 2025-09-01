import memoize from "micro-memoize";
import { NextRequest, NextResponse } from "next/server";
import { getValueMemoized, RequestContext } from "./utils";

export async function middleware(request: NextRequest) {
  RequestContext.enterWith('middleware')
  const value = await getValueMemoized();
  console.log("middleware", { value });
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
