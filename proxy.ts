import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Next 16 renamed Middleware to Proxy. This does two things and deliberately
 * not a third:
 *
 *  - refreshes the Supabase auth cookie, which has to happen somewhere that
 *    can write cookies on the response;
 *  - bounces a visitor with no session away from /admin, which is an
 *    optimistic check only.
 *
 * It is NOT the authorisation boundary. Proxy runs on prefetches and only sees
 * the cookie, which the browser owns. Whether a signed-in user may actually
 * read an enquiry is decided by verifySession() in lib/auth.ts and by row
 * level security in the database.
 */
export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        for (const { name, value, options } of toSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const to = request.nextUrl.clone();
    to.pathname = "/admin/login";
    to.search = "";
    return NextResponse.redirect(to);
  }

  // Deliberately no "signed in, so send them to /admin" rule. The proxy cannot
  // see whether an account is an admin, so that redirect fought with the page's
  // own authorisation check and produced a loop. /admin decides for itself.

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
