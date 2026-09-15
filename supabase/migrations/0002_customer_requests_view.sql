-- One place to read enquiries for both ElectronIx products.
--
-- This project already holds the ElectronIx DNC site's enquiries in
-- quote_requests. ElectronIx Trace is a different product with a different
-- form -- a Trace enquiry carries company, line_count and machine_types, a DNC
-- enquiry carries shop_name and num_cncs -- so they stay in separate tables
-- rather than sharing one mostly-empty row shape.
--
-- What they do share is a name, a contact and a date. customer_requests unions
-- that much, with the product named on every row.

alter table public.quote_requests
    add column if not exists product text not null default 'ElectronIx DNC';

comment on column public.quote_requests.product is
  'Names the product this enquiry is for. See the customer_requests view.';

create or replace view public.customer_requests
-- security_invoker means the view is read with the caller's own privileges, so
-- it inherits each table's row level security instead of bypassing it as the
-- owner. Neither table grants anon a select policy, so anon sees nothing here.
-- Without this a view silently becomes a public read of a private leads table.
with (security_invoker = on) as
    select
        q.id,
        q.product,
        q.created_at,
        q.name,
        q.shop_name      as company,
        q.email,
        q.contact        as phone,
        null::text       as city,
        q.source         as source_page
    from public.quote_requests q
    union all
    select
        t.id,
        t.product,
        t.created_at,
        t.name,
        t.company,
        t.email,
        t.phone,
        t.city,
        t.source_page
    from public.trace_leads t;

comment on view public.customer_requests is
  'Enquiries for both ElectronIx products, newest first when ordered by created_at. Readable with the service role only.';

revoke all on public.customer_requests from anon, authenticated;
