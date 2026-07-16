import { nhost } from './nhost';

export type SalonOnboardingInput = {
  name: string;
  slug: string;
  category: string;
  description: string;
  addressLine: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  instagram: string;
  primaryColor: string;
  priceLevel: number;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  professionalName: string;
  weekdays: number[];
  opensAt: string;
  closesAt: string;
};

export type CreatedSalon = {
  id: string;
  name: string;
  slug: string;
  primary_color: string;
  published: boolean;
  plan_status: string;
};

type CreateSalonResponse = { insert_salons_one: CreatedSalon | null };
type MySalonsResponse = { salons: CreatedSalon[] };

const CREATE_SALON = `
  mutation CreateSalon($object: salons_insert_input!) {
    insert_salons_one(object: $object) {
      id
      name
      slug
      primary_color
      published
      plan_status
    }
  }
`;

const CREATE_INITIAL_SETUP = `
  mutation CreateInitialSetup(
    $service: services_insert_input!,
    $professional: professionals_insert_input!,
    $hours: [business_hours_insert_input!]!
  ) {
    insert_services_one(object: $service) { id }
    insert_professionals_one(object: $professional) { id }
    insert_business_hours(objects: $hours) { affected_rows }
  }
`;

const MY_SALONS = `
  query MySalons {
    salons(order_by: { created_at: desc }) {
      id
      name
      slug
      primary_color
      published
      plan_status
    }
  }
`;

export function slugifySalon(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export async function createSalonOnboarding(input: SalonOnboardingInput) {
  if (!nhost) throw new Error('Nhost não está configurado.');

  const salonResult = await nhost.graphql.request<CreateSalonResponse, { object: Record<string, unknown> }>({
    query: CREATE_SALON,
    variables: {
      object: {
        name: input.name,
        slug: input.slug,
        timezone: 'America/Sao_Paulo',
        category: input.category,
        description: input.description || null,
        address_line: input.addressLine,
        neighborhood: input.neighborhood,
        city: input.city,
        state: input.state.toUpperCase(),
        postal_code: input.postalCode,
        phone: input.phone,
        instagram: input.instagram || null,
        primary_color: input.primaryColor,
        price_level: input.priceLevel,
      },
    },
  });
  const salon = salonResult.body.data?.insert_salons_one;
  if (!salon) throw new Error('Não foi possível criar o salão.');

  const hours = input.weekdays.map((weekday) => ({
    salon_id: salon.id,
    weekday,
    opens_at: input.opensAt,
    closes_at: input.closesAt,
  }));

  await nhost.graphql.request({
    query: CREATE_INITIAL_SETUP,
    variables: {
      service: {
        salon_id: salon.id,
        name: input.serviceName,
        duration_minutes: input.serviceDuration,
        price_cents: Math.round(input.servicePrice * 100),
        active: true,
        published: true,
      },
      professional: {
        salon_id: salon.id,
        display_name: input.professionalName,
        active: true,
      },
      hours,
    },
  });

  return salon;
}

export async function loadMySalons() {
  if (!nhost) return [];
  const result = await nhost.graphql.request<MySalonsResponse>({ query: MY_SALONS });
  return result.body.data?.salons ?? [];
}
