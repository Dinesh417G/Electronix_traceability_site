import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { ScrollRegion } from "@/components/ui/scroll-region";

export const metadata: Metadata = {
  title: "Enquiries — ElectronIx",
  robots: { index: false, follow: false },
};

// Enquiries change whenever someone submits the form, so this must never be
// prerendered or cached.
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  product: string;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  source_page: string | null;
  email_verified: boolean;
};

const PRODUCTS = ["All", "ElectronIx Trace", "ElectronIx DNC"] as const;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  // The real check. The proxy only bounced visitors with no cookie at all.
  const session = await verifySession();
  if (session.state === "anonymous") redirect("/admin/login");

  // Signed in, but not on the allow-list. Rendered rather than redirected, so
  // they get an answer and a way out instead of bouncing off the login form.
  if (session.state === "denied") {
    return (
      <div className="shell py-20">
        <div className="max-w-md">
          <p className="section-index mb-3">Enquiries</p>
          <h1 className="text-2xl">No access</h1>
          <p className="mt-4 text-sm leading-relaxed text-steel-400">
            You are signed in as <span className="data">{session.email}</span>, but that account
            is not on the list of people who may read enquiries. Ask whoever runs the site to
            add it.
          </p>
          <form action={signOut} className="mt-8">
            <button type="submit" className="btn btn-secondary">
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  const { product } = await searchParams;
  const active = PRODUCTS.find((p) => p === product) ?? "All";

  const supabase = await createSupabaseServerClient();
  let rows: Row[] = [];
  let loadError: string | null = null;

  if (supabase) {
    let query = supabase
      .from("customer_requests")
      .select("id,product,created_at,name,company,email,phone,city,source_page,email_verified")
      .order("created_at", { ascending: false })
      .limit(200);

    if (active !== "All") query = query.eq("product", active);

    const { data, error } = await query;
    if (error) loadError = error.message;
    else rows = (data ?? []) as Row[];
  }

  const counts = {
    trace: rows.filter((r) => r.product === "ElectronIx Trace").length,
    dnc: rows.filter((r) => r.product === "ElectronIx DNC").length,
  };

  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="section-index mb-3">Enquiries</p>
          <h1 className="text-2xl">Customer requests</h1>
        </div>
        <form action={signOut}>
          <button type="submit" className="btn btn-secondary">
            Sign out
          </button>
        </form>
      </div>

      <p className="mt-4 text-sm text-steel-400">
        Signed in as <span className="data">{session.email}</span>. Showing{" "}
        <span className="data">{rows.length}</span>{" "}
        {active === "All" ? "across both products" : `for ${active}`}
        {active === "All" && rows.length > 0 && (
          <>
            {" "}
            — <span className="data">{counts.trace}</span> Trace,{" "}
            <span className="data">{counts.dnc}</span> DNC
          </>
        )}
        .
      </p>

      <div
        role="tablist"
        aria-label="Filter by product"
        className="mt-8 flex flex-wrap gap-x-1 border-b border-[var(--rule)]"
      >
        {PRODUCTS.map((p) => (
          <a
            key={p}
            role="tab"
            aria-selected={active === p}
            href={p === "All" ? "/admin" : `/admin?product=${encodeURIComponent(p)}`}
            className={`-mb-px flex min-h-11 items-center border-b-2 px-3 text-sm transition-colors ${
              active === p
                ? "border-signal text-line-050"
                : "border-transparent text-steel-400 hover:border-[var(--rule-strong)] hover:text-line-050"
            }`}
          >
            {p}
          </a>
        ))}
      </div>

      {loadError ? (
        <p role="alert" className="mt-8 border border-reject/40 bg-reject/10 p-4 text-sm verdict-fail">
          Could not load enquiries: {loadError}
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-steel-500">
          No enquiries {active === "All" ? "yet" : `for ${active} yet`}.
        </p>
      ) : (
        <ScrollRegion label="Customer enquiries" className="panel mt-8">
          <table className="data-table stack">
            <caption className="sr-only">Customer enquiries for both ElectronIx products</caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Product</th>
                <th scope="col">Company</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.product}-${r.id}`}>
                  <td data-stack-title>
                    {r.name}
                    {r.city && <span className="mt-1 block text-xs text-steel-500">{r.city}</span>}
                  </td>
                  <td data-label="Product">
                    <span className={`chip ${r.product === "ElectronIx Trace" ? "chip-signal" : ""}`}>
                      {r.product}
                    </span>
                  </td>
                  <td data-label="Company" className="text-steel-400">{r.company ?? "—"}</td>
                  <td data-label="Email">
                    <a href={`mailto:${r.email}`} className="data text-xs underline underline-offset-2">
                      {r.email}
                    </a>
                    {!r.email_verified && (
                      <span className="mt-1 block text-[0.625rem] text-steel-500">
                        not confirmed
                      </span>
                    )}
                  </td>
                  <td data-label="Phone">
                    {r.phone ? (
                      <a href={`tel:${r.phone}`} className="data text-xs underline underline-offset-2">
                        {r.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td data-label="When" className="data whitespace-nowrap text-xs text-steel-400">
                    {new Date(r.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
      )}
    </div>
  );
}
