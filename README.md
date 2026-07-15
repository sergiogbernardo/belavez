# BelaVez

**Seu salão, no tempo certo.**

Plataforma de agendamento para salões, barbearias, estúdios de unhas, estética
e outros negócios de beleza. Cada estabelecimento administra sua equipe,
serviços, disponibilidade e clientes em um espaço isolado, enquanto o público
agenda por uma página própria do negócio.

## Stack

- React 19, TypeScript e Vite;
- Supabase Auth e PostgreSQL com Row Level Security (RLS);
- PWA responsiva;
- GitHub Pages e GitHub Actions.

## Primeiro MVP

- cadastro e configuração de vários salões;
- perfis de proprietário, gestor, recepção e profissional;
- serviços com duração e preço;
- jornada de trabalho e bloqueios por profissional;
- agenda diária e semanal;
- cadastro de clientes;
- criação, confirmação, reagendamento e cancelamento de horários;
- página pública de cada salão para solicitação de agendamento;
- isolamento dos dados de cada salão com RLS.

Ficam para etapas posteriores: pagamentos, WhatsApp automático, programa de
fidelidade, estoque, comissões, caixa e marketplace público de salões.

## Desenvolvimento

Requer Node.js 22.13 ou posterior.

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env.local` e informe somente a URL e a chave
**publishable** do Supabase. Chaves secretas, `service_role`, senha do banco e
connection strings nunca devem ser enviadas ao navegador.

## GitHub Pages

O frontend será publicado em `https://sabion.io/belavez/`. O workflow de deploy
usa as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`
configuradas no repositório.

## Documentação

- [Plano de produto](docs/plano-de-produto.md)
- [Arquitetura e dados](docs/arquitetura-e-dados.md)
- [Decisões em aberto](docs/decisoes-em-aberto.md)

