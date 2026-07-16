export type Service = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number | null;
};

export type Professional = {
  id: string;
  name: string;
  bio: string | null;
  serviceIds: string[];
};

export type BusinessHour = {
  weekday: number;
  opensAt: string;
  closesAt: string;
};

export type SalonCatalog = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  location: string;
  rating: number;
  reviewCount: number;
  services: Service[];
  professionals: Professional[];
  businessHours: BusinessHour[];
};

export type BookingDetails = {
  name: string;
  phone: string;
  email: string;
};

export type MarketplaceSalon = {
  id: string;
  name: string;
  slug: string;
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  priceFromCents: number;
  nextAvailable: string;
  categories: string[];
  services: string[];
  theme: 'rose' | 'sage' | 'sand' | 'plum' | 'blue' | 'terracotta';
  featured?: boolean;
};
