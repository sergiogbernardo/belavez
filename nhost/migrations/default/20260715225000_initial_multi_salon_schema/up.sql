create extension if not exists btree_gist;

create type public.salon_role as enum ('owner', 'manager', 'receptionist', 'professional');
create type public.appointment_status as enum (
  'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.salons (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  timezone text not null default 'America/Sao_Paulo',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.salon_memberships (
  salon_id uuid not null references public.salons (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.salon_role not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (salon_id, user_id)
);

create table public.professionals (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  display_name text not null check (char_length(trim(display_name)) between 2 and 120),
  bio text check (bio is null or char_length(bio) <= 1000),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (salon_id, user_id),
  unique (salon_id, id)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 120),
  description text check (description is null or char_length(description) <= 1000),
  duration_minutes integer not null check (duration_minutes between 5 and 720),
  price_cents integer check (price_cents is null or price_cents >= 0),
  active boolean not null default true,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (salon_id, id)
);

create table public.professional_services (
  salon_id uuid not null references public.salons (id) on delete cascade,
  professional_id uuid not null,
  service_id uuid not null,
  duration_minutes integer check (duration_minutes is null or duration_minutes between 5 and 720),
  price_cents integer check (price_cents is null or price_cents >= 0),
  primary key (professional_id, service_id),
  foreign key (salon_id, professional_id)
    references public.professionals (salon_id, id) on delete cascade,
  foreign key (salon_id, service_id)
    references public.services (salon_id, id) on delete cascade
);

create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  opens_at time not null,
  closes_at time not null,
  check (opens_at < closes_at),
  unique (salon_id, weekday, opens_at)
);

create table public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons (id) on delete cascade,
  professional_id uuid not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text check (reason is null or char_length(reason) <= 240),
  created_at timestamptz not null default now(),
  check (starts_at < ends_at),
  foreign key (salon_id, professional_id)
    references public.professionals (salon_id, id) on delete cascade
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email is not null or phone is not null),
  unique (salon_id, id)
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons (id) on delete cascade,
  client_id uuid not null,
  professional_id uuid not null,
  service_id uuid not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.appointment_status not null default 'pending',
  client_notes text check (client_notes is null or char_length(client_notes) <= 1000),
  internal_notes text check (internal_notes is null or char_length(internal_notes) <= 2000),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (starts_at < ends_at),
  foreign key (salon_id, client_id) references public.clients (salon_id, id),
  foreign key (salon_id, professional_id) references public.professionals (salon_id, id),
  foreign key (salon_id, service_id) references public.services (salon_id, id)
);

alter table public.appointments
  add constraint appointments_professional_time_excl
  exclude using gist (
    professional_id with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status in ('pending', 'confirmed', 'in_progress'));

create index salon_memberships_user_idx
  on public.salon_memberships (user_id) where active;
create index professionals_salon_idx
  on public.professionals (salon_id) where active;
create index services_salon_idx
  on public.services (salon_id) where active;
create index appointments_salon_start_idx
  on public.appointments (salon_id, starts_at);
create index appointments_client_idx
  on public.appointments (client_id, starts_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger salons_set_updated_at before update on public.salons
  for each row execute procedure public.set_updated_at();
create trigger professionals_set_updated_at before update on public.professionals
  for each row execute procedure public.set_updated_at();
create trigger services_set_updated_at before update on public.services
  for each row execute procedure public.set_updated_at();
create trigger clients_set_updated_at before update on public.clients
  for each row execute procedure public.set_updated_at();
create trigger appointments_set_updated_at before update on public.appointments
  for each row execute procedure public.set_updated_at();

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(nullif(trim(new.display_name), ''), 'Novo usuário')
  );
  return new;
end;
$$;

create trigger belavez_on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

comment on table public.appointments is
  'Appointment writes are exposed only through reviewed Hasura permissions and controlled backend operations.';
