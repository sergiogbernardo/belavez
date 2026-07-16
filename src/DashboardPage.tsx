import { useEffect, useState, type CSSProperties } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Palette,
  Plus,
  Scissors,
  Settings,
  Sparkles,
  Store,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { nhost } from './lib/nhost';
import { loadMySalons, type CreatedSalon } from './lib/onboarding';

type DashboardSalon = CreatedSalon & { primaryColor?: string };

const appointments = [
  { time: '09:00', client: 'Mariana Oliveira', service: 'Corte', professional: 'Marina Costa', status: 'Confirmado' },
  { time: '10:30', client: 'Camila Santos', service: 'Coloração', professional: 'Luiza Nunes', status: 'Confirmado' },
  { time: '13:00', client: 'Ana Clara', service: 'Escova', professional: 'Marina Costa', status: 'Pendente' },
  { time: '15:30', client: 'Fernanda Lima', service: 'Tratamento', professional: 'Rafael Lima', status: 'Confirmado' },
];

function DashboardBrand() {
  return <a className="brand" href="#/" aria-label="BelaVez — início"><span className="brand-mark"><Sparkles /></span><span className="brand-name">Bela<span>Vez</span></span></a>;
}

export default function DashboardPage() {
  const [salon, setSalon] = useState<DashboardSalon | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const demoRaw = localStorage.getItem('belavez-demo-salon');
    if (demoRaw) {
      const demo = JSON.parse(demoRaw) as { id: string; name: string; slug: string; primaryColor: string; published: boolean; plan_status: string };
      setSalon({ ...demo, primary_color: demo.primaryColor });
      setLoading(false);
      return;
    }
    if (!nhost?.getUserSession()) {
      setLoading(false);
      return;
    }
    loadMySalons().then((items) => setSalon(items[0] || null)).finally(() => setLoading(false));
  }, []);

  function signOut() {
    nhost?.clearSession();
    localStorage.removeItem('belavez-demo-salon');
    window.location.hash = '#/';
  }

  if (loading) return <div className="dashboard-loading"><Sparkles /><span>Preparando seu painel...</span></div>;

  if (!salon) {
    return <div className="dashboard-gate"><DashboardBrand /><div><Store /><p className="overline">Painel do salão</p><h1>Entre para administrar seu espaço.</h1><p>Acesse sua conta ou cadastre seu salão para configurar equipe, serviços e agenda.</p><a href="#/cadastro-salao">Entrar ou criar conta <ArrowRight /></a><a href="#/" className="gate-back">Voltar ao marketplace</a></div></div>;
  }

  const salonColor = salon.primary_color || salon.primaryColor || '#693849';
  const initials = salon.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  return (
    <div className="dashboard-page" style={{ '--dashboard-color': salonColor } as CSSProperties}>
      <aside className={menuOpen ? 'is-open' : ''}>
        <DashboardBrand />
        <div className="dashboard-salon-switch"><span>{initials}</span><div><small>Meu estabelecimento</small><strong>{salon.name}</strong></div></div>
        <nav aria-label="Navegação do painel">
          <button className="active" type="button"><LayoutDashboard /> Visão geral</button>
          <button type="button"><CalendarDays /> Agenda <span>4</span></button>
          <button type="button"><UsersRound /> Equipe</button>
          <button type="button"><Scissors /> Serviços</button>
          <button type="button"><UserRound /> Clientes</button>
          <button type="button"><Palette /> Minha vitrine</button>
          <button type="button"><BarChart3 /> Relatórios</button>
        </nav>
        <div className="dashboard-side-bottom"><button type="button"><Settings /> Configurações</button><button type="button" onClick={signOut}><LogOut /> Sair</button></div>
      </aside>

      <main>
        <header className="dashboard-topbar"><button className="dashboard-menu" type="button" onClick={() => setMenuOpen(!menuOpen)}><Menu /></button><div><p>Visão geral</p><span>{new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(new Date())}</span></div><div><button type="button"><Bell /></button><span className="dashboard-user">{initials}</span></div></header>
        <div className="dashboard-content">
          <section className="dashboard-welcome"><div><p className="overline">Bom trabalho hoje</p><h1>Olá! Seu salão está ganhando forma.</h1><p>Acompanhe a agenda e conclua os últimos passos para publicar sua vitrine.</p></div><a href={`#/salao/${salon.slug}`}>Ver vitrine <ExternalLink /></a></section>

          <section className="dashboard-stats"><article><span><CalendarDays /></span><div><small>Agendamentos hoje</small><strong>4</strong><p>3 confirmados</p></div></article><article><span><UsersRound /></span><div><small>Clientes no mês</small><strong>28</strong><p>+12% no período</p></div></article><article><span><Clock3 /></span><div><small>Ocupação da agenda</small><strong>64%</strong><p>18 horários livres</p></div></article><article><span><Scissors /></span><div><small>Serviço mais buscado</small><strong>Corte</strong><p>11 reservas</p></div></article></section>

          <section className="dashboard-grid">
            <div className="today-agenda"><div className="panel-heading"><div><h2>Agenda de hoje</h2><span>4 atendimentos</span></div><button type="button"><Plus /> Novo horário</button></div><div className="agenda-list">{appointments.map((item) => <article key={`${item.time}-${item.client}`}><time>{item.time}</time><span className="agenda-avatar">{item.client.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><strong>{item.client}</strong><small>{item.service} · {item.professional}</small></div><span className={`agenda-status ${item.status === 'Pendente' ? 'pending' : ''}`}>{item.status}</span><button type="button">•••</button></article>)}</div><button className="view-full-agenda" type="button">Ver agenda completa <ArrowRight /></button></div>

            <div className="dashboard-setup"><div className="panel-heading"><div><h2>Prepare sua vitrine</h2><span>3 de 5 etapas</span></div><b>60%</b></div><div className="setup-progress"><span /></div><ul><li className="done"><CheckCircle2 /><div><strong>Dados do negócio</strong><small>Informações principais concluídas</small></div></li><li className="done"><CheckCircle2 /><div><strong>Primeiro serviço</strong><small>Seu catálogo já começou</small></div></li><li className="done"><CheckCircle2 /><div><strong>Horários</strong><small>Agenda configurada</small></div></li><li><span>4</span><div><strong>Adicione seu logotipo</strong><small>Personalize a identidade</small></div></li><li><span>5</span><div><strong>Ative seu plano</strong><small>Publique no marketplace</small></div></li></ul><button type="button"><Palette /> Continuar configuração</button></div>
          </section>

          <section className="dashboard-tip"><Sparkles /><div><strong>Dica BelaVez</strong><p>Salões com logo, capa e descrição completa recebem mais visitas na vitrine.</p></div><button type="button">Personalizar agora</button></section>
        </div>
      </main>
    </div>
  );
}
