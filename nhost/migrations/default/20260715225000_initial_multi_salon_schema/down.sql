drop trigger if exists belavez_on_auth_user_created on auth.users;
drop function if exists public.handle_new_auth_user();

drop trigger if exists appointments_set_updated_at on public.appointments;
drop trigger if exists clients_set_updated_at on public.clients;
drop trigger if exists services_set_updated_at on public.services;
drop trigger if exists professionals_set_updated_at on public.professionals;
drop trigger if exists salons_set_updated_at on public.salons;
drop trigger if exists profiles_set_updated_at on public.profiles;
drop function if exists public.set_updated_at();

drop table if exists public.appointments;
drop table if exists public.clients;
drop table if exists public.availability_blocks;
drop table if exists public.business_hours;
drop table if exists public.professional_services;
drop table if exists public.services;
drop table if exists public.professionals;
drop table if exists public.salon_memberships;
drop table if exists public.salons;
drop table if exists public.profiles;

drop type if exists public.appointment_status;
drop type if exists public.salon_role;
