insert into public.salons (id, name, slug, timezone, active)
values (
  '11111111-1111-4111-8111-111111111111',
  'Ateliê Aurora',
  'atelie-aurora',
  'America/Sao_Paulo',
  true
)
on conflict (slug) do update
set
  name = excluded.name,
  timezone = excluded.timezone,
  active = excluded.active;

insert into public.clients (id, salon_id, full_name, email, phone)
select
  '22222222-2222-4222-8222-222222222222',
  salons.id,
  'Mariana Oliveira (Teste)',
  'mariana.teste@belavez.example',
  '+55 11 00000-0000'
from public.salons
where salons.slug = 'atelie-aurora'
on conflict (id) do update
set
  salon_id = excluded.salon_id,
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone;
