import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Menu,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import { demoCatalog } from './data/demoCatalog';
import { loadPublicCatalog } from './lib/catalog';
import type { BookingDetails, BusinessHour, Professional, SalonCatalog, Service } from './types';

const emptyDetails: BookingDetails = { name: '', phone: '', email: '' };

function formatMoney(value: number | null) {
  if (value === null) return 'Consulte';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100);
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function dateKey(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function nextDates(amount = 7) {
  return Array.from({ length: amount }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index + 1);
    return date;
  });
}

function slotsForDate(date: Date, businessHours: BusinessHour[]) {
  const period = businessHours.find((item) => item.weekday === date.getDay());
  if (!period) return [];
  const [openHour, openMinute] = period.opensAt.split(':').map(Number);
  const [closeHour, closeMinute] = period.closesAt.split(':').map(Number);
  const start = openHour * 60 + openMinute;
  const end = closeHour * 60 + closeMinute;
  return Array.from({ length: Math.max(0, Math.floor((end - start) / 60)) }, (_, index) => {
    const minutes = start + index * 60;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  });
}

function Brand() {
  return (
    <a className="brand" href="./" aria-label="BelaVez — início">
      <span className="brand-mark" aria-hidden="true"><Sparkles /></span>
      <span className="brand-name">Bela<span>Vez</span></span>
    </a>
  );
}

function ServiceCard({ service, selected, onSelect }: { service: Service; selected: boolean; onSelect: () => void }) {
  return (
    <button className={`choice-card service-card ${selected ? 'is-selected' : ''}`} type="button" onClick={onSelect}>
      <span className="service-icon" aria-hidden="true"><Scissors /></span>
      <span className="choice-copy">
        <strong>{service.name}</strong>
        <small>{service.description}</small>
        <span className="choice-meta"><b>{formatMoney(service.priceCents)}</b><i />{formatDuration(service.durationMinutes)}</span>
      </span>
      <span className="choice-check" aria-hidden="true">{selected ? <Check /> : <ChevronRight />}</span>
    </button>
  );
}

function ProfessionalCard({ professional, selected, onSelect }: { professional: Professional; selected: boolean; onSelect: () => void }) {
  return (
    <button className={`choice-card professional-card ${selected ? 'is-selected' : ''}`} type="button" onClick={onSelect}>
      <span className="avatar" aria-hidden="true">{initials(professional.name)}</span>
      <span className="choice-copy">
        <strong>{professional.name}</strong>
        <small>{professional.bio || 'Profissional do salão'}</small>
      </span>
      <span className="choice-check" aria-hidden="true">{selected ? <Check /> : <ChevronRight />}</span>
    </button>
  );
}

function BookingSummary({ service, professional, date, time }: {
  service: Service | null;
  professional: Professional | null;
  date: Date | null;
  time: string | null;
}) {
  return (
    <aside className="booking-summary" aria-label="Resumo do agendamento">
      <p className="overline">Seu agendamento</p>
      {service ? (
        <>
          <div className="summary-service">
            <span className="summary-icon"><Scissors /></span>
            <div><strong>{service.name}</strong><small>{formatDuration(service.durationMinutes)}</small></div>
          </div>
          <dl>
            <div><dt>Profissional</dt><dd>{professional?.name || 'Primeiro disponível'}</dd></div>
            <div><dt>Data</dt><dd>{date ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long' }).format(date) : 'A escolher'}</dd></div>
            <div><dt>Horário</dt><dd>{time || 'A escolher'}</dd></div>
          </dl>
          <div className="summary-total"><span>Total</span><strong>{formatMoney(service.priceCents)}</strong></div>
        </>
      ) : (
        <div className="empty-summary"><CalendarDays /><span>Suas escolhas aparecerão aqui.</span></div>
      )}
      <p className="safe-note"><ShieldCheck /> Seus dados ficam protegidos.</p>
    </aside>
  );
}

export default function App() {
  const [catalog, setCatalog] = useState<SalonCatalog>(demoCatalog);
  const [isDemo, setIsDemo] = useState(true);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [details, setDetails] = useState<BookingDetails>(emptyDetails);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('salao') || 'atelie-aurora';
    let active = true;
    loadPublicCatalog(slug)
      .then((remoteCatalog) => {
        if (!active || !remoteCatalog || remoteCatalog.services.length === 0) return;
        setCatalog(remoteCatalog);
        setIsDemo(false);
      })
      .catch(() => undefined)
      .finally(() => active && setLoadingCatalog(false));
    return () => { active = false; };
  }, []);

  const dates = useMemo(() => nextDates(), []);
  const service = catalog.services.find((item) => item.id === serviceId) || null;
  const availableProfessionals = catalog.professionals.filter((professional) =>
    !serviceId || professional.serviceIds.length === 0 || professional.serviceIds.includes(serviceId));
  const professional = catalog.professionals.find((item) => item.id === professionalId) || null;
  const availableSlots = selectedDate ? slotsForDate(selectedDate, catalog.businessHours) : [];

  function selectService(id: string) {
    setServiceId(id);
    if (professionalId && !catalog.professionals.find((item) => item.id === professionalId)?.serviceIds.includes(id)) {
      setProfessionalId(null);
    }
  }

  function advance() {
    if (step === 1 && serviceId) setStep(2);
    if (step === 2) setStep(3);
    if (step === 3 && selectedDate && selectedTime) setStep(4);
  }

  function submitBooking(event: FormEvent) {
    event.preventDefault();
    if (!details.name.trim() || !details.phone.trim()) return;
    setCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restart() {
    setStep(1);
    setServiceId(null);
    setProfessionalId(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setDetails(emptyDetails);
    setCompleted(false);
  }

  const canAdvance = (step === 1 && Boolean(serviceId))
    || step === 2
    || (step === 3 && Boolean(selectedDate && selectedTime));

  return (
    <div className="app-shell">
      <header className="site-header">
        <Brand />
        <nav className={mobileMenu ? 'is-open' : ''} aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a>
          <a href="#para-saloes">Para salões</a>
          <button className="login-button" type="button">Entrar</button>
        </nav>
        <button className="menu-button" type="button" aria-label={mobileMenu ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </header>

      {isDemo && !loadingCatalog && (
        <div className="demo-banner"><Sparkles /> Experiência de demonstração — o catálogo real entra quando o primeiro salão for cadastrado.</div>
      )}

      <main>
        <section className="salon-hero" aria-labelledby="salon-name">
          <div className="salon-hero-inner">
            <div className="salon-monogram" aria-hidden="true">AA</div>
            <div className="salon-heading">
              <p className="overline">Agendamento online</p>
              <h1 id="salon-name">{catalog.name}</h1>
              <div className="salon-meta">
                <span><MapPin /> {catalog.location}</span>
                <span><Star className="star" /> {catalog.rating.toFixed(1)} <small>({catalog.reviewCount} avaliações)</small></span>
              </div>
            </div>
            <div className="open-status"><i /> Agenda aberta</div>
          </div>
        </section>

        {completed ? (
          <section className="success-panel" aria-live="polite">
            <span className="success-icon"><CheckCircle2 /></span>
            <p className="overline">Demonstração concluída</p>
            <h2>Seu horário está pronto, {details.name.split(' ')[0]}.</h2>
            <p>O fluxo completo funcionou. A gravação e a confirmação real serão conectadas ao Nhost na próxima etapa.</p>
            <div className="success-recap">
              <span><CalendarDays /> {selectedDate && new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(selectedDate)}, {selectedTime}</span>
              <span><Scissors /> {service?.name} com {professional?.name || 'o primeiro profissional disponível'}</span>
            </div>
            <button className="primary-button" type="button" onClick={restart}>Fazer outra simulação</button>
          </section>
        ) : (
          <section className="booking-layout" aria-label="Agendar horário">
            <div className="booking-card">
              <div className="progress" aria-label={`Etapa ${step} de 4`}>
                {[1, 2, 3, 4].map((item) => <span key={item} className={item <= step ? 'active' : ''} />)}
              </div>

              <div className="booking-title">
                {step > 1 && <button className="back-button" type="button" aria-label="Voltar" onClick={() => setStep(step - 1)}><ArrowLeft /></button>}
                <div>
                  <p className="overline">Etapa {step} de 4</p>
                  <h2>{step === 1 && 'O que vamos fazer hoje?'}{step === 2 && 'Com quem você prefere?'}{step === 3 && 'Escolha o melhor horário'}{step === 4 && 'Só faltam seus dados'}</h2>
                  <p>{step === 1 && 'Selecione um serviço para ver os horários disponíveis.'}{step === 2 && 'Escolha alguém da equipe ou veja a primeira disponibilidade.'}{step === 3 && 'Os horários são exibidos no fuso do salão.'}{step === 4 && 'Usaremos essas informações apenas para confirmar a reserva.'}</p>
                </div>
              </div>

              {step === 1 && <div className="choice-list">{catalog.services.map((item) => <ServiceCard key={item.id} service={item} selected={serviceId === item.id} onSelect={() => selectService(item.id)} />)}</div>}

              {step === 2 && (
                <div className="choice-list">
                  <button className={`choice-card professional-card ${professionalId === null ? 'is-selected' : ''}`} type="button" onClick={() => setProfessionalId(null)}>
                    <span className="avatar avatar-any"><UsersRound /></span>
                    <span className="choice-copy"><strong>Primeiro disponível</strong><small>Encontre o horário mais próximo</small></span>
                    <span className="choice-check">{professionalId === null ? <Check /> : <ChevronRight />}</span>
                  </button>
                  {availableProfessionals.map((item) => <ProfessionalCard key={item.id} professional={item} selected={professionalId === item.id} onSelect={() => setProfessionalId(item.id)} />)}
                </div>
              )}

              {step === 3 && (
                <div className="schedule-picker">
                  <div className="date-strip">
                    {dates.map((date) => {
                      const selected = selectedDate && dateKey(selectedDate) === dateKey(date);
                      return (
                        <button key={dateKey(date)} className={selected ? 'is-selected' : ''} type="button" onClick={() => { setSelectedDate(date); setSelectedTime(null); }}>
                          <small>{new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date).replace('.', '')}</small>
                          <strong>{date.getDate()}</strong>
                          <span>{new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date).replace('.', '')}</span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedDate ? (
                    availableSlots.length ? (
                      <div className="time-section">
                        <p><Clock3 /> Horários disponíveis</p>
                        <div className="time-grid">{availableSlots.map((time) => <button key={time} className={selectedTime === time ? 'is-selected' : ''} type="button" onClick={() => setSelectedTime(time)}>{time}</button>)}</div>
                      </div>
                    ) : <div className="no-slots"><CalendarDays /><strong>Salão fechado neste dia</strong><span>Escolha outra data para continuar.</span></div>
                  ) : <div className="no-slots"><CalendarDays /><strong>Escolha uma data</strong><span>Os horários disponíveis aparecerão aqui.</span></div>}
                </div>
              )}

              {step === 4 && (
                <form id="booking-details" className="details-form" onSubmit={submitBooking}>
                  <label><span>Seu nome</span><div className="input-wrap"><UserRound /><input required value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} placeholder="Nome e sobrenome" autoComplete="name" /></div></label>
                  <label><span>WhatsApp</span><div className="input-prefix"><b>+55</b><input required value={details.phone} onChange={(event) => setDetails({ ...details, phone: event.target.value })} placeholder="(11) 99999-9999" inputMode="tel" autoComplete="tel" /></div></label>
                  <label><span>E-mail <small>(opcional)</small></span><input type="email" value={details.email} onChange={(event) => setDetails({ ...details, email: event.target.value })} placeholder="voce@exemplo.com" autoComplete="email" /></label>
                  <label className="consent"><input required type="checkbox" /><span>Concordo em receber mensagens sobre este agendamento.</span></label>
                </form>
              )}

              <div className="booking-actions">
                <span>{step < 4 ? 'Você pode revisar tudo antes de confirmar.' : 'Nenhuma cobrança será feita agora.'}</span>
                {step < 4 ? <button className="primary-button" type="button" disabled={!canAdvance} onClick={advance}>Continuar <ArrowRight /></button> : <button className="primary-button" type="submit" form="booking-details">Concluir demonstração <Check /></button>}
              </div>
            </div>

            <BookingSummary service={service} professional={professional} date={selectedDate} time={selectedTime} />
          </section>
        )}

        <section className="trust-section" id="como-funciona">
          <p className="overline">Simples de verdade</p>
          <h2>Seu próximo cuidado em poucos passos.</h2>
          <div className="trust-grid">
            <article><span>01</span><Scissors /><h3>Escolha o serviço</h3><p>Veja duração, valor e todos os detalhes antes de decidir.</p></article>
            <article><span>02</span><CalendarDays /><h3>Encontre um horário</h3><p>Disponibilidade real da equipe, sem troca de mensagens.</p></article>
            <article><span>03</span><CheckCircle2 /><h3>Confirme seus dados</h3><p>Receba as informações da reserva diretamente no celular.</p></article>
          </div>
        </section>

        <section className="business-cta" id="para-saloes">
          <div><p className="overline">BelaVez para negócios</p><h2>Menos tempo organizando. Mais tempo cuidando.</h2><p>Agenda, equipe e experiência do cliente em um só lugar.</p></div>
          <button className="light-button" type="button"><Store /> Quero conhecer</button>
        </section>
      </main>

      <footer><Brand /><span>© 2026 BelaVez</span><a href="#salon-name">Voltar ao topo</a></footer>
    </div>
  );
}
