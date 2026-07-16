import { FormEvent, useMemo, useState, type CSSProperties } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  LockKeyhole,
  Mail,
  MapPin,
  Palette,
  Scissors,
  Sparkles,
  Store,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { nhost } from './lib/nhost';
import { createSalonOnboarding, slugifySalon, type SalonOnboardingInput } from './lib/onboarding';

const weekdays = [
  { value: 1, label: 'Seg' }, { value: 2, label: 'Ter' }, { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' }, { value: 5, label: 'Sex' }, { value: 6, label: 'Sáb' },
  { value: 0, label: 'Dom' },
];

const initialForm: SalonOnboardingInput = {
  name: '', slug: '', category: 'Salão de beleza', description: '', addressLine: '',
  neighborhood: '', city: 'São Paulo', state: 'SP', postalCode: '', phone: '', instagram: '',
  primaryColor: '#693849', priceLevel: 2, serviceName: 'Corte', servicePrice: 80,
  serviceDuration: 60, professionalName: '', weekdays: [1, 2, 3, 4, 5, 6],
  opensAt: '09:00', closesAt: '19:00',
};

function OnboardingBrand() {
  return <a className="brand" href="#/" aria-label="BelaVez — início"><span className="brand-mark"><Sparkles /></span><span className="brand-name">Bela<span>Vez</span></span></a>;
}

export default function OnboardingPage() {
  const existingSession = nhost?.getUserSession();
  const [step, setStep] = useState(existingSession ? 1 : 0);
  const [demoMode, setDemoMode] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [ownerName, setOwnerName] = useState(existingSession?.user?.displayName || '');
  const [email, setEmail] = useState(existingSession?.user?.email || '');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const previewInitials = useMemo(() => form.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'SE', [form.name]);

  function update<K extends keyof SalonOnboardingInput>(key: K, value: SalonOnboardingInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateName(value: string) {
    setForm((current) => ({ ...current, name: value, slug: slugifySalon(value) }));
  }

  async function handleAuth(event: FormEvent) {
    event.preventDefault();
    if (!nhost) return setError('A conexão com o Nhost não está disponível.');
    setSubmitting(true); setError(''); setNotice('');
    try {
      if (authMode === 'signup') {
        const result = await nhost.auth.signUpEmailPassword({
          email,
          password,
          options: { displayName: ownerName, locale: 'pt', redirectTo: `${window.location.origin}/belavez/` },
        });
        if (!result.body.session) {
          setNotice('Conta criada. Verifique seu e-mail e depois entre para continuar.');
          setAuthMode('login');
          return;
        }
      } else {
        const result = await nhost.auth.signInEmailPassword({ email, password });
        if (!result.body.session) throw new Error('E-mail ou senha inválidos.');
      }
      setStep(1);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Não foi possível autenticar.');
    } finally {
      setSubmitting(false);
    }
  }

  function continueDemo() {
    setDemoMode(true);
    setOwnerName('Proprietário de teste');
    setStep(1);
  }

  function next(event: FormEvent) {
    event.preventDefault();
    setError('');
    setStep((current) => Math.min(4, current + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function finish() {
    setSubmitting(true); setError('');
    try {
      if (demoMode) {
        localStorage.setItem('belavez-demo-salon', JSON.stringify({ ...form, id: 'demo-onboarding', published: false, plan_status: 'trial' }));
      } else {
        const salon = await createSalonOnboarding(form);
        localStorage.setItem('belavez-last-salon', JSON.stringify(salon));
      }
      window.location.hash = '#/painel';
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível concluir o cadastro.');
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 0) {
    return (
      <div className="onboarding-auth-page">
        <header><OnboardingBrand /><a href="#/para-saloes"><ArrowLeft /> Conhecer o plano</a></header>
        <main>
          <section className="onboarding-auth-copy"><p className="hub-eyebrow"><Store /> Comece pelo seu espaço</p><h1>Vamos colocar seu salão no mapa.</h1><p>Crie sua conta de proprietário. Depois você personaliza a vitrine, equipe, serviços e horários.</p><ul><li><CheckCircle2 /> 14 dias para experimentar</li><li><CheckCircle2 /> Sem comissão por agendamento</li><li><CheckCircle2 /> Cancele quando quiser</li></ul></section>
          <section className="auth-card">
            <div className="auth-tabs"><button className={authMode === 'signup' ? 'active' : ''} type="button" onClick={() => setAuthMode('signup')}>Criar conta</button><button className={authMode === 'login' ? 'active' : ''} type="button" onClick={() => setAuthMode('login')}>Já tenho conta</button></div>
            <form onSubmit={handleAuth}>
              {authMode === 'signup' && <label><span>Seu nome</span><div><UserRound /><input required maxLength={32} value={ownerName} onChange={(event) => setOwnerName(event.target.value)} placeholder="Nome do proprietário" /></div></label>}
              <label><span>E-mail profissional</span><div><Mail /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@salao.com.br" /></div></label>
              <label><span>Senha</span><div><LockKeyhole /><input required minLength={8} maxLength={50} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 8 caracteres" /></div></label>
              {error && <p className="form-message is-error">{error}</p>}
              {notice && <p className="form-message is-success">{notice}</p>}
              <button className="onboarding-primary" disabled={submitting} type="submit">{submitting ? 'Aguarde...' : authMode === 'signup' ? 'Criar conta e continuar' : 'Entrar e continuar'} <ArrowRight /></button>
            </form>
            <div className="demo-divider"><span>ou</span></div>
            <button className="demo-flow-button" type="button" onClick={continueDemo}><Eye /> Ver fluxo de demonstração</button>
            <small>Na demonstração, os dados ficam apenas neste navegador.</small>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      <header className="onboarding-header"><OnboardingBrand /><span>{demoMode ? 'Modo demonstração' : `Olá, ${ownerName.split(' ')[0] || 'proprietário'}`}</span><a href="#/">Sair</a></header>
      <div className="onboarding-shell">
        <aside className="onboarding-sidebar">
          <p>Configure seu espaço</p>
          {[{ n: 1, icon: Building2, label: 'Seu negócio' }, { n: 2, icon: Palette, label: 'Sua marca' }, { n: 3, icon: Scissors, label: 'Operação' }, { n: 4, icon: CheckCircle2, label: 'Revisar' }].map(({ n, icon: Icon, label }) => (
            <button key={n} className={n === step ? 'active' : n < step ? 'done' : ''} type="button" disabled={n > step} onClick={() => setStep(n)}><span>{n < step ? <Check /> : <Icon />}</span><div><small>Etapa {n}</small><strong>{label}</strong></div></button>
          ))}
          <div className="onboarding-help"><Sparkles /><strong>Precisa de ajuda?</strong><span>Vamos acompanhar você em cada etapa.</span></div>
        </aside>

        <main className="onboarding-content">
          <div className="onboarding-mobile-progress"><span style={{ width: `${step * 25}%` }} /></div>
          {step === 1 && <form onSubmit={next}><div className="step-heading"><p className="overline">Etapa 1 de 4</p><h1>Conte sobre seu negócio.</h1><p>Essas informações serão a base da sua vitrine no BelaVez.</p></div><div className="onboarding-form-grid"><label className="full"><span>Nome do salão</span><input required value={form.name} onChange={(event) => updateName(event.target.value)} placeholder="Ex.: Ateliê Aurora" /></label><label><span>Categoria principal</span><select value={form.category} onChange={(event) => update('category', event.target.value)}><option>Salão de beleza</option><option>Barbearia</option><option>Studio de unhas</option><option>Estética</option><option>Spa e massagem</option><option>Cílios e sobrancelhas</option></select></label><label><span>Link da vitrine</span><div className="slug-input"><b>belavez/</b><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => update('slug', slugifySalon(event.target.value))} /></div></label><label className="full"><span>Descrição</span><textarea maxLength={1200} value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Conte o que torna seu espaço especial..." /></label><label className="full"><span>Endereço</span><div className="with-icon"><MapPin /><input required value={form.addressLine} onChange={(event) => update('addressLine', event.target.value)} placeholder="Rua, número e complemento" /></div></label><label><span>Bairro</span><input required value={form.neighborhood} onChange={(event) => update('neighborhood', event.target.value)} /></label><label><span>Cidade</span><input required value={form.city} onChange={(event) => update('city', event.target.value)} /></label><label><span>Estado</span><input required maxLength={2} value={form.state} onChange={(event) => update('state', event.target.value.toUpperCase())} /></label><label><span>CEP</span><input value={form.postalCode} onChange={(event) => update('postalCode', event.target.value)} placeholder="00000-000" /></label><label><span>WhatsApp</span><input required value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="(11) 99999-9999" /></label><label><span>Instagram</span><input value={form.instagram} onChange={(event) => update('instagram', event.target.value)} placeholder="@seusalao" /></label></div><div className="onboarding-actions"><a href="#/">Salvar e sair</a><button className="onboarding-primary" type="submit">Continuar <ArrowRight /></button></div></form>}

              {step === 2 && <form onSubmit={next}><div className="step-heading"><p className="overline">Etapa 2 de 4</p><h1>Deixe a vitrine com a sua cara.</h1><p>Comece pela cor principal. Logo e capa poderão ser enviados pelo painel.</p></div><div className="brand-builder"><div className="brand-controls"><label><span>Cor principal</span><div className="color-control"><input type="color" value={form.primaryColor} onChange={(event) => update('primaryColor', event.target.value)} /><input pattern="#[0-9A-Fa-f]{6}" value={form.primaryColor} onChange={(event) => update('primaryColor', event.target.value)} /></div></label><label><span>Faixa de preço</span><div className="price-level">{[1, 2, 3, 4].map((level) => <button key={level} className={form.priceLevel === level ? 'active' : ''} type="button" onClick={() => update('priceLevel', level)}>{'$'.repeat(level)}</button>)}</div></label><div className="upload-placeholder"><Palette /><strong>Logo e foto de capa</strong><span>Disponível após concluir o cadastro.</span></div></div><div className="salon-live-preview" style={{ '--salon-color': form.primaryColor } as CSSProperties}><div className="preview-cover"><span>{previewInitials}</span></div><div><small>Agendamento online</small><h2>{form.name || 'Seu salão'}</h2><p><MapPin /> {form.neighborhood || 'Seu bairro'}, {form.city}</p><div><span>{form.category}</span><span>{'$'.repeat(form.priceLevel)}</span></div></div></div></div><div className="onboarding-actions"><button type="button" onClick={() => setStep(1)}><ArrowLeft /> Voltar</button><button className="onboarding-primary" type="submit">Continuar <ArrowRight /></button></div></form>}

          {step === 3 && <form onSubmit={next}><div className="step-heading"><p className="overline">Etapa 3 de 4</p><h1>Prepare sua operação.</h1><p>Cadastre um primeiro serviço, profissional e os horários. Depois você adiciona quantos quiser.</p></div><div className="setup-block"><div className="setup-title"><Scissors /><div><strong>Primeiro serviço</strong><span>O que seus clientes poderão agendar?</span></div></div><div className="onboarding-form-grid three"><label><span>Nome do serviço</span><input required value={form.serviceName} onChange={(event) => update('serviceName', event.target.value)} /></label><label><span>Preço (R$)</span><input required min="0" type="number" value={form.servicePrice} onChange={(event) => update('servicePrice', Number(event.target.value))} /></label><label><span>Duração</span><select value={form.serviceDuration} onChange={(event) => update('serviceDuration', Number(event.target.value))}><option value={30}>30 min</option><option value={45}>45 min</option><option value={60}>1 hora</option><option value={90}>1h30</option><option value={120}>2 horas</option></select></label></div></div><div className="setup-block"><div className="setup-title"><UsersRound /><div><strong>Primeiro profissional</strong><span>Pode ser você ou alguém da equipe.</span></div></div><label><span>Nome do profissional</span><input required value={form.professionalName} onChange={(event) => update('professionalName', event.target.value)} placeholder="Nome completo" /></label></div><div className="setup-block"><div className="setup-title"><CalendarDays /><div><strong>Horário do salão</strong><span>Selecione os dias de funcionamento.</span></div></div><div className="weekday-picker">{weekdays.map((day) => <button key={day.value} className={form.weekdays.includes(day.value) ? 'active' : ''} type="button" onClick={() => update('weekdays', form.weekdays.includes(day.value) ? form.weekdays.filter((item) => item !== day.value) : [...form.weekdays, day.value])}>{day.label}</button>)}</div><div className="hours-row"><label><span>Abre às</span><div><Clock3 /><input required type="time" value={form.opensAt} onChange={(event) => update('opensAt', event.target.value)} /></div></label><label><span>Fecha às</span><div><Clock3 /><input required type="time" value={form.closesAt} onChange={(event) => update('closesAt', event.target.value)} /></div></label></div></div><div className="onboarding-actions"><button type="button" onClick={() => setStep(2)}><ArrowLeft /> Voltar</button><button className="onboarding-primary" type="submit">Revisar cadastro <ArrowRight /></button></div></form>}

          {step === 4 && <div><div className="step-heading"><p className="overline">Última etapa</p><h1>Está tudo pronto para começar.</h1><p>Confira o resumo. Sua vitrine ficará privada até você decidir publicar.</p></div><div className="review-card"><div className="review-brand" style={{ background: form.primaryColor }}><span>{previewInitials}</span></div><div><h2>{form.name}</h2><p>{form.category} · {form.neighborhood}, {form.city}</p><span>Plano em teste por 14 dias</span></div></div><div className="review-grid"><article><Building2 /><span>Negócio</span><strong>{form.slug}</strong><small>{form.phone}</small></article><article><Scissors /><span>Serviço inicial</span><strong>{form.serviceName}</strong><small>R$ {form.servicePrice.toFixed(2).replace('.', ',')} · {form.serviceDuration} min</small></article><article><UserRound /><span>Profissional</span><strong>{form.professionalName}</strong><small>{form.weekdays.length} dias de funcionamento</small></article></div>{error && <p className="form-message is-error">{error}</p>}<div className="publish-note"><LockKeyhole /><div><strong>Publicação segura</strong><span>Você poderá revisar a vitrine no painel antes de aparecer nas buscas.</span></div></div><div className="onboarding-actions"><button type="button" onClick={() => setStep(3)}><ArrowLeft /> Voltar</button><button className="onboarding-primary" disabled={submitting} type="button" onClick={finish}>{submitting ? 'Criando seu espaço...' : demoMode ? 'Abrir painel de demonstração' : 'Criar meu salão'} <Check /></button></div></div>}
        </main>
      </div>
    </div>
  );
}
