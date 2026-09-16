-- ElectronIx Trace website — lead capture.
--
-- The anonymous role may INSERT and nothing else. It must never be able to
-- SELECT: a marketing site's public key is in every visitor's browser, and a
-- readable leads table is a competitor's prospect list.

create table if not exists public.trace_leads (
    id            uuid primary key default gen_random_uuid(),
    created_at    timestamptz not null default now(),
    name          text not null,
    company       text not null,
    phone         text not null,
    email         text not null,
    city          text,
    industry      text,
    line_count    text,
    machine_types text,
    message       text,
    source_page   text not null default '/',
    utm_source    text,
    utm_medium    text,
    utm_campaign  text,
    referrer      text,

    -- Names the product this enquiry is for. The ElectronIx DNC site writes
    -- its own enquiries into quote_requests in this same project; this column
    -- is what tells the two apart in the customer_requests view.
    product       text not null default 'ElectronIx Trace',

    constraint trace_leads_name_len    check (char_length(name) between 2 and 120),
    constraint trace_leads_company_len check (char_length(company) between 2 and 160),
    constraint trace_leads_email_len   check (char_length(email) between 5 and 160),
    constraint trace_leads_phone_len   check (char_length(phone) between 7 and 24),
    constraint trace_leads_message_len check (message is null or char_length(message) <= 2000)
);

create index if not exists trace_leads_created_at_idx on public.trace_leads (created_at desc);
create index if not exists trace_leads_source_idx     on public.trace_leads (source_page, created_at desc);

alter table public.trace_leads enable row level security;

-- Insert only, for anonymous and authenticated web visitors.
drop policy if exists trace_leads_anon_insert on public.trace_leads;
create policy trace_leads_anon_insert
    on public.trace_leads
    for insert
    to anon, authenticated
    with check (true);

-- No select, update or delete policy is defined for anon or authenticated, so
-- RLS denies all three. The service role bypasses RLS and is the only way the
-- server route reads or writes; that key stays server-side.

revoke all on public.trace_leads from anon, authenticated;
grant insert on public.trace_leads to anon, authenticated;

comment on table public.trace_leads is
  'Website enquiries. Anonymous role may insert only; reads require the service role.';
