import { nhost } from './nhost';
import type { BusinessHour, Professional, SalonCatalog, Service } from '../types';

type SalonRow = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
};

type ServiceRow = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number | null;
};

type ProfessionalRow = {
  id: string;
  display_name: string;
  bio: string | null;
};

type ProfessionalServiceRow = {
  professional_id: string;
  service_id: string;
};

type BusinessHourRow = {
  weekday: number;
  opens_at: string;
  closes_at: string;
};

type SalonResponse = { salons: SalonRow[] };
type CatalogResponse = {
  services: ServiceRow[];
  professionals: ProfessionalRow[];
  professional_services: ProfessionalServiceRow[];
  business_hours: BusinessHourRow[];
};

const SALON_QUERY = `
  query PublicSalon($slug: String!) {
    salons(where: { slug: { _eq: $slug } }, limit: 1) {
      id
      name
      slug
      timezone
    }
  }
`;

const CATALOG_QUERY = `
  query PublicCatalog($salonId: uuid!) {
    services(where: { salon_id: { _eq: $salonId } }, order_by: { name: asc }) {
      id
      name
      description
      duration_minutes
      price_cents
    }
    professionals(where: { salon_id: { _eq: $salonId } }, order_by: { display_name: asc }) {
      id
      display_name
      bio
    }
    professional_services(where: { salon_id: { _eq: $salonId } }) {
      professional_id
      service_id
    }
    business_hours(where: { salon_id: { _eq: $salonId } }, order_by: { weekday: asc }) {
      weekday
      opens_at
      closes_at
    }
  }
`;

export async function loadPublicCatalog(slug: string): Promise<SalonCatalog | null> {
  if (!nhost) return null;

  const salonResult = await nhost.graphql.request<SalonResponse, { slug: string }>({
    query: SALON_QUERY,
    variables: { slug },
  });
  const salon = salonResult.body.data?.salons[0];
  if (!salon) return null;

  const catalogResult = await nhost.graphql.request<CatalogResponse, { salonId: string }>({
    query: CATALOG_QUERY,
    variables: { salonId: salon.id },
  });
  const data = catalogResult.body.data;
  if (!data) return null;

  const services: Service[] = data.services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description ?? 'Serviço oferecido pelo salão.',
    durationMinutes: service.duration_minutes,
    priceCents: service.price_cents,
  }));
  const professionals: Professional[] = data.professionals.map((professional) => ({
    id: professional.id,
    name: professional.display_name,
    bio: professional.bio,
    serviceIds: data.professional_services
      .filter((item) => item.professional_id === professional.id)
      .map((item) => item.service_id),
  }));
  const businessHours: BusinessHour[] = data.business_hours.map((hours) => ({
    weekday: hours.weekday,
    opensAt: hours.opens_at.slice(0, 5),
    closesAt: hours.closes_at.slice(0, 5),
  }));

  return {
    ...salon,
    location: 'Brasil',
    rating: 5,
    reviewCount: 0,
    services,
    professionals,
    businessHours,
  };
}
