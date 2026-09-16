import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase client bound to the request's cookies.
 *
 * The publishable key is deliberate: every query this client makes is subject
 * to row level security, so what a signed-in visitor can read is decided in
 * the database rather than by which key the server happens to hold. Reading
 * enquiries requires a row in `public.admins`, which only the service role can
 * grant.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies are read-only. The
          // refreshed session is still written by the proxy on the next
          // request, so this is safe to swallow — it is the documented
          // @supabase/ssr pattern.
        }
      },
    },
  });
}
