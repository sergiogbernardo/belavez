alter table public.salons
  add column created_by uuid references auth.users (id) on delete set null,
  add column category text,
  add column description text check (description is null or char_length(description) <= 1200),
  add column address_line text,
  add column neighborhood text,
  add column city text,
  add column state char(2),
  add column postal_code text,
  add column phone text,
  add column instagram text,
  add column logo_url text,
  add column cover_url text,
  add column primary_color text not null default '#693849'
    check (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  add column price_level smallint check (price_level is null or price_level between 1 and 4),
  add column published boolean not null default false,
  add column featured boolean not null default false,
  add column plan_status text not null default 'trial'
    check (plan_status in ('trial', 'active', 'past_due', 'cancelled')),
  add column trial_ends_at timestamptz not null default (now() + interval '14 days');

create index salons_marketplace_location_idx
  on public.salons (city, state, neighborhood)
  where active and published;

create function public.handle_new_salon_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.created_by is not null then
    insert into public.salon_memberships (salon_id, user_id, role, active)
    values (new.id, new.created_by, 'owner', true)
    on conflict (salon_id, user_id) do update
      set role = 'owner', active = true;
  end if;
  return new;
end;
$$;

create trigger salons_create_owner_membership
  after insert on public.salons
  for each row execute procedure public.handle_new_salon_owner();
