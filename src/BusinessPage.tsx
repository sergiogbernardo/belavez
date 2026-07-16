import { ArrowLeft, ArrowRight, CalendarDays, Check, Palette, Sparkles, Store, UsersRound } from 'lucide-react';

export default function BusinessPage() {
  return (
    <div className="business-page">
      <header className="business-header">
        <a href="#/" className="back-to-hub"><ArrowLeft /> Voltar ao BelaVez</a>
        <a className="brand" href="#/" aria-label="BelaVez — início"><span className="brand-mark"><Sparkles /></span><span className="brand-name">Bela<span>Vez</span></span></a>
        <a className="business-login" href="#/painel">Entrar</a>
      </header>
      <main>
        <section className="business-hero">
          <div><p className="hub-eyebrow"><Store /> BelaVez para negócios</p><h1>Seu salão mais organizado, visível e fácil de agendar.</h1><p>Tenha sua própria vitrine dentro do hub de beleza, uma agenda completa para a equipe e mais caminhos para novos clientes encontrarem você.</p><div className="business-hero-actions"><button type="button" onClick={() => document.getElementById('plano')?.scrollIntoView({ behavior: 'smooth' })}>Conhecer o plano <ArrowRight /></button><span>Plano único · sem comissão por reserva</span></div></div>
          <div className="business-dashboard-mock" aria-label="Prévia do painel BelaVez"><div className="mock-top"><span><Sparkles /> BelaVez</span><i /><i /></div><div className="mock-body"><aside><b /><b /><b /><b /></aside><div><p>Visão geral</p><section><article><small>Agendamentos hoje</small><strong>12</strong></article><article><small>Novos clientes</small><strong>28</strong></article></section><div className="mock-calendar"><span /><span /><span /><span /><span /></div></div></div></div>
        </section>
        <section className="business-benefits"><article><Palette /><h3>A sua marca</h3><p>Personalize cores, capa, logotipo, descrição e o endereço da sua vitrine.</p></article><article><UsersRound /><h3>Toda a equipe</h3><p>Cadastre profissionais, serviços, preços, jornadas, folgas e bloqueios.</p></article><article><CalendarDays /><h3>Agenda central</h3><p>Receba, confirme e acompanhe os agendamentos de todos em um só lugar.</p></article></section>
        <section className="single-plan" id="plano"><div><p className="overline">Um plano. Tudo incluído.</p><h2>Simples para começar e crescer.</h2><p>Sem comissão por agendamento e sem cobrar por cada profissional cadastrado.</p></div><article><span className="plan-badge">Plano BelaVez</span><h3>Mensalidade única</h3><p className="plan-price">Condição de lançamento <small>em definição</small></p><ul><li><Check /> Vitrine no marketplace</li><li><Check /> Personalização da marca</li><li><Check /> Profissionais e serviços</li><li><Check /> Agenda e bloqueios</li><li><Check /> Gestão de clientes</li><li><Check /> Link próprio para compartilhar</li></ul><a className="start-onboarding" href="#/cadastro-salao">Quero fazer parte <ArrowRight /></a><small>Comece com 14 dias para experimentar.</small></article></section>
      </main>
    </div>
  );
}
