drop trigger if exists salons_create_owner_membership on public.salons;
drop function if exists public.handle_new_salon_owner();
drop index if exists public.salons_marketplace_location_idx;

alter table public.salons
  drop column if exists trial_ends_at,
  drop column if exists plan_status,
  drop column if exists featured,
  drop column if exists published,
  drop column if exists price_level,
  drop column if exists primary_color,
  drop column if exists cover_url,
  drop column if exists logo_url,
  drop column if exists instagram,
  drop column if exists phone,
  drop column if exists postal_code,
  drop column if exists state,
  drop column if exists city,
  drop column if exists neighborhood,
  drop column if exists address_line,
  drop column if exists description,
  drop column if exists category,
  drop column if exists created_by;
