-- Owner sign-in, and double opt-in on Trace enquiries.
--
-- Two separate ideas that share a migration because they share a purpose:
-- making the enquiries in this project safe to read and worth trusting.

-- Who may read enquiries. Membership is granted by the service role only --
-- there is deliberately no policy letting a signed-in user add themselves.
create table if not exists public.admins (
    user_id    uuid primary key references auth.users (id) on delete cascade,
    email      text not null,
    created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;

drop policy if exists admins_self_read on public.admins;
create policy admins_self_read
    on public.admins for select to authenticated
    using (user_id = auth.uid());

-- security definer so the policies below can call it without each caller
-- needing to read the whole admins table.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- Double opt-in, mirroring the columns the ElectronIx DNC site already uses.
-- Only a hash of the token is stored: the raw token lives in the emailed link
-- and nowhere else, so a leaked row cannot be used to confirm an address that
-- its owner never confirmed.
alter table public.trace_leads
    add column if not exists email_verified    boolean not null default false,
    add column if not exists verified_at       timestamptz,
    add column if not exists owner_alerted_at  timestamptz,
    add column if not exists verify_token_hash text,
    add column if not exists verify_sent_at    timestamptz;

create index if not exists trace_leads_verify_token_idx
    on public.trace_leads (verify_token_hash)
    where verify_token_hash is not null;

-- Admins may read enquiries for both products. anon is untouched and still
-- sees nothing; this adds no access for the ElectronIx DNC site's visitors.
grant select on public.trace_leads to authenticated;
drop policy if exists trace_leads_admin_read on public.trace_leads;
create policy trace_leads_admin_read
    on public.trace_leads for select to authenticated
    using (public.is_admin());

grant select on public.quote_requests to authenticated;
drop policy if exists quote_requests_admin_read on public.quote_requests;
create policy quote_requests_admin_read
    on public.quote_requests for select to authenticated
    using (public.is_admin());

-- The view gains the confirmation state, so the inbox can show it.
create or replace view public.customer_requests
with (security_invoker = on) as
    select q.id, q.product, q.created_at, q.name, q.shop_name as company, q.email,
           q.contact as phone, null::text as city, q.source as source_page,
           q.email_verified, q.verified_at
    from public.quote_requests q
    union all
    select t.id, t.product, t.created_at, t.name, t.company, t.email,
           t.phone, t.city, t.source_page,
           t.email_verified, t.verified_at
    from public.trace_leads t;

revoke all on public.customer_requests from anon;
grant select on public.customer_requests to authenticated;
