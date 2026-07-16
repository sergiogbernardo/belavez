import { CalendarDays, Check, Store } from 'lucide-react';
import { isNhostConfigured } from './lib/nhost';

const foundations = [
  'Uma plataforma para vários salões',
  'Agenda individual por profissional',
  'Página de agendamento de cada negócio',
];

export default function App() {
  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <div className="brand" aria-label="BelaVez">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>BelaVez</span>
        </div>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Seu salão, no tempo certo.</p>
            <h1 id="page-title">A nova agenda dos negócios de beleza.</h1>
            <p className="intro">
              O BelaVez está nascendo para conectar clientes, profissionais e salões em uma
              experiência simples de agendamento.
            </p>

            <ul className="foundation-list">
              {foundations.map((item) => (
                <li key={item}><Check aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>

          <aside className="status-card" aria-label="Fundação do produto">
            <div className="status-icon"><CalendarDays aria-hidden="true" /></div>
            <p className="status-label">Fundação do produto</p>
            <h2>Primeira etapa em construção</h2>
            <div className="status-row">
              <Store aria-hidden="true" />
              <span>Estrutura multi-salão preparada</span>
            </div>
            <p className="environment-status">
              Nhost {isNhostConfigured ? 'conectado' : 'aguardando configuração'}
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
