import { NextResponse } from "next/server";

export function middleware(request) {
  const host = request.headers.get("host");

  // Define your domain and subdomain
  const mainDomain = "questionthem-admin.com";
  const subdomain = "mysubsite.questionthem-admin.com";

  // Check if the host is your subdomain
  if (host === subdomain) {
    // Rewrite the request to your subdomain's page
    return NextResponse.rewrite(new URL("/mysubsite", request.url));
  }

  // If the host is the main domain or a different domain, continue as normal
  return NextResponse.next();
}

export const config = {
  // Match all requests except static files and API routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
