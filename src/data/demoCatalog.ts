import type { SalonCatalog } from '../types';

export const demoCatalog: SalonCatalog = {
  id: 'demo-salon',
  name: 'Ateliê Aurora',
  slug: 'atelie-aurora',
  timezone: 'America/Sao_Paulo',
  location: 'Pinheiros, São Paulo',
  rating: 4.9,
  reviewCount: 127,
  services: [
    {
      id: 'corte-assinatura',
      name: 'Corte assinatura',
      description: 'Consulta, corte personalizado e finalização.',
      durationMinutes: 60,
      priceCents: 12000,
    },
    {
      id: 'escova-modelada',
      name: 'Escova modelada',
      description: 'Preparação, escova e acabamento com movimento.',
      durationMinutes: 45,
      priceCents: 8500,
    },
    {
      id: 'coloracao',
      name: 'Coloração personalizada',
      description: 'Diagnóstico de cor, aplicação e tratamento pós-química.',
      durationMinutes: 150,
      priceCents: 28000,
    },
    {
      id: 'tratamento',
      name: 'Ritual de tratamento',
      description: 'Tratamento escolhido para a necessidade atual dos fios.',
      durationMinutes: 50,
      priceCents: 14000,
    },
  ],
  professionals: [
    {
      id: 'marina',
      name: 'Marina Costa',
      bio: 'Cortes e textura natural',
      serviceIds: ['corte-assinatura', 'escova-modelada', 'tratamento'],
    },
    {
      id: 'luiza',
      name: 'Luiza Nunes',
      bio: 'Colorista e especialista em loiros',
      serviceIds: ['coloracao', 'tratamento', 'escova-modelada'],
    },
    {
      id: 'rafael',
      name: 'Rafael Lima',
      bio: 'Cortes, visagismo e finalização',
      serviceIds: ['corte-assinatura', 'escova-modelada'],
    },
  ],
  businessHours: [
    { weekday: 1, opensAt: '09:00', closesAt: '19:00' },
    { weekday: 2, opensAt: '09:00', closesAt: '19:00' },
    { weekday: 3, opensAt: '09:00', closesAt: '19:00' },
    { weekday: 4, opensAt: '09:00', closesAt: '20:00' },
    { weekday: 5, opensAt: '09:00', closesAt: '20:00' },
    { weekday: 6, opensAt: '09:00', closesAt: '17:00' },
  ],
};
