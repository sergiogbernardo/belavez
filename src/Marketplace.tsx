import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  LocateFixed,
  MapPin,
  Menu,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  X,
} from 'lucide-react';
import { marketplaceSalons } from './data/demoCatalog';
import type { MarketplaceSalon } from './types';

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value / 100);
}

function HubBrand() {
  return (
    <a className="brand" href="#/" aria-label="BelaVez — início">
      <span className="brand-mark" aria-hidden="true"><Sparkles /></span>
      <span className="brand-name">Bela<span>Vez</span></span>
    </a>
  );
}

function SalonCard({ salon }: { salon: MarketplaceSalon }) {
  return (
    <article className="hub-salon-card">
      <a className={`salon-cover salon-cover--${salon.theme}`} href={`#/salao/${salon.slug}`} aria-label={`Conhecer ${salon.name}`}>
        <span className="cover-glow" />
        <span className="cover-monogram">{salon.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
        {salon.featured && <span className="featured-label"><Sparkles /> Destaque BelaVez</span>}
        <span className="available-label"><i /> {salon.nextAvailable}</span>
      </a>
      <div className="salon-card-body">
        <div className="salon-card-heading">
          <div><h3><a href={`#/salao/${salon.slug}`}>{salon.name}</a></h3><p><MapPin /> {salon.location} · {salon.distance}</p></div>
          <span className="rating-pill"><Star /> {salon.rating.toFixed(1)}</span>
        </div>
        <div className="salon-tags">{salon.categories.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="salon-card-footer">
          <span>A partir de <strong>{formatMoney(salon.priceFromCents)}</strong></span>
          <a href={`#/salao/${salon.slug}`}>Ver perfil <ArrowRight /></a>
        </div>
      </div>
    </article>
  );
}

export default function Marketplace() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('São Paulo, SP');
  const [service, setService] = useState('');
  const [onlyToday, setOnlyToday] = useState(false);
  const [sort, setSort] = useState('recommended');

  const allServices = useMemo(() => Array.from(new Set(marketplaceSalons.flatMap((salon) => salon.services))).sort(), []);
  const filteredSalons = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
    const normalizedLocation = location.trim().toLocaleLowerCase('pt-BR');
    const salons = marketplaceSalons.filter((salon) => {
      const searchable = [salon.name, salon.location, ...salon.categories, ...salon.services].join(' ').toLocaleLowerCase('pt-BR');
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesLocation = !normalizedLocation || salon.location.toLocaleLowerCase('pt-BR').includes(normalizedLocation.split(',')[0]);
      const matchesService = !service || salon.services.includes(service);
      const matchesToday = !onlyToday || salon.nextAvailable.startsWith('Hoje');
      return matchesQuery && matchesLocation && matchesService && matchesToday;
    });
    return salons.sort((left, right) => {
      if (sort === 'rating') return right.rating - left.rating;
      if (sort === 'price') return left.priceFromCents - right.priceFromCents;
      return Number(Boolean(right.featured)) - Number(Boolean(left.featured));
    });
  }, [location, onlyToday, query, service, sort]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' });
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="hub-page">
      <header className="hub-header">
        <HubBrand />
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Navegação principal">
          <button className="hub-nav-link" type="button" onClick={() => scrollToSection('resultados')}>Explorar salões</button>
          <button className="hub-nav-link" type="button" onClick={() => scrollToSection('como-funciona')}>Como funciona</button>
          <a href="#/para-saloes">Para salões</a>
          <button className="hub-login" type="button">Entrar</button>
        </nav>
        <button className="menu-button" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="hub-hero">
          <div className="hub-hero-copy">
            <p className="hub-eyebrow"><Sparkles /> Beleza perto de você</p>
            <h1>Seu próximo cuidado começa aqui.</h1>
            <p>Encontre salões, profissionais e horários disponíveis. Compare, escolha e agende em poucos minutos.</p>
          </div>
          <form className="hub-search" onSubmit={submitSearch}>
            <label><span>O que você procura?</span><div><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Corte, manicure, massagem..." /></div></label>
            <label><span>Onde?</span><div><MapPin /><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Cidade ou bairro" /></div></label>
            <label><span>Serviço</span><div><Sparkles /><select value={service} onChange={(event) => setService(event.target.value)}><option value="">Todos os serviços</option>{allServices.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown className="select-chevron" /></div></label>
            <button type="submit"><Search /> Buscar</button>
          </form>
          <div className="popular-searches"><span>Buscas populares:</span>{['Corte', 'Barbearia', 'Manicure', 'Massagem'].map((item) => <button key={item} type="button" onClick={() => setQuery(item)}>{item}</button>)}</div>
        </section>

        <section className="location-strip">
          <span><LocateFixed /> Explorando <strong>{location || 'todo o Brasil'}</strong></span>
          <button type="button" onClick={() => setLocation('São Paulo, SP')}>Usar minha localização</button>
        </section>

        <section className="hub-results" id="resultados">
          <div className="results-heading">
            <div><p className="overline">Descubra novos lugares</p><h2>Salões que combinam com você</h2><span>{filteredSalons.length} {filteredSalons.length === 1 ? 'estabelecimento encontrado' : 'estabelecimentos encontrados'}</span></div>
            <label className="sort-control"><SlidersHorizontal /><span>Ordenar por</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recomendados</option><option value="rating">Melhor avaliados</option><option value="price">Menor preço</option></select><ChevronDown /></label>
          </div>
          <div className="filter-row">
            <button className={onlyToday ? 'is-active' : ''} type="button" onClick={() => setOnlyToday(!onlyToday)}><Clock3 /> Disponível hoje</button>
            <button type="button" onClick={() => setSort('rating')}><Star /> Melhor avaliados</button>
            <button type="button" onClick={() => setSort('price')}>Menor preço</button>
            {(query || service || onlyToday) && <button className="clear-filter" type="button" onClick={() => { setQuery(''); setService(''); setOnlyToday(false); }}>Limpar filtros <X /></button>}
          </div>
          {filteredSalons.length ? <div className="salon-grid">{filteredSalons.map((salon) => <SalonCard key={salon.id} salon={salon} />)}</div> : <div className="empty-results"><Search /><h3>Nenhum salão encontrado</h3><p>Tente outro serviço, bairro ou remova os filtros.</p><button type="button" onClick={() => { setQuery(''); setService(''); setOnlyToday(false); }}>Ver todos os salões</button></div>}
        </section>

        <section className="hub-how" id="como-funciona">
          <div className="hub-section-title"><p className="overline">Do desejo ao horário marcado</p><h2>Agendar ficou leve.</h2></div>
          <div className="hub-how-grid">
            <article><span>1</span><Search /><h3>Descubra</h3><p>Busque por serviço, localização, preço e disponibilidade.</p></article>
            <article><span>2</span><Store /><h3>Compare</h3><p>Conheça cada salão, equipe, valores e avaliações.</p></article>
            <article><span>3</span><CalendarDays /><h3>Agende</h3><p>Escolha o melhor horário e acompanhe tudo pelo BelaVez.</p></article>
          </div>
        </section>

        <section className="hub-business">
          <div className="business-art"><span className="business-phone"><Store /><b>Seu salão</b><small>com agenda própria</small></span><i /><i /></div>
          <div><p className="overline">Seu salão no BelaVez</p><h2>Transforme visitas em clientes recorrentes.</h2><p>Crie uma vitrine com a sua marca, organize equipe e serviços e receba agendamentos pelo hub.</p><ul><li><CheckCircle2 /> Página personalizada</li><li><CheckCircle2 /> Agenda da equipe</li><li><CheckCircle2 /> Plano mensal único</li></ul><a className="hub-business-button" href="#/para-saloes">Quero cadastrar meu salão <ArrowRight /></a></div>
        </section>
      </main>

      <footer className="hub-footer"><HubBrand /><div><button type="button" onClick={() => scrollToSection('resultados')}>Explorar</button><a href="#/para-saloes">Para salões</a><button type="button" onClick={() => scrollToSection('como-funciona')}>Como funciona</button></div><span>© 2026 BelaVez</span></footer>
    </div>
  );
}
