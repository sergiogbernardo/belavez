# BelaVez

**Seu salão, no tempo certo.**

Hub de descoberta e agendamento para salões, barbearias, estúdios de unhas,
estética e outros negócios de beleza. O público encontra e compara negócios por
localização, serviço, preço e disponibilidade. Cada estabelecimento contratado
ganha uma vitrine personalizável e administra equipe, serviços e agenda.

## Stack

- React 19, TypeScript e Vite;
- Nhost Auth, PostgreSQL e Hasura GraphQL;
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
- isolamento dos dados de cada salão com permissões declarativas no Hasura.

Ficam para etapas posteriores: pagamentos, WhatsApp automático, programa de
fidelidade, estoque, comissões, caixa e marketplace público de salões.

## Estado atual

A página inicial funciona como marketplace com busca, localização, filtros e
vitrines de demonstração. Cada card abre a página personalizada do salão, que
possui um fluxo responsivo com escolha de serviço, profissional, data, horário,
identificação do cliente, resumo e conclusão.

A área “Para salões” apresenta o plano mensal único e a proposta de contratação.
O botão de contratação abre um cadastro guiado em quatro etapas: conta do
proprietário, dados do negócio, identidade visual e configuração inicial de
serviço, profissional e horário. Existe um modo de demonstração que salva os
dados somente no navegador para testar toda a experiência sem criar uma conta.

Depois do cadastro, o proprietário entra em um primeiro painel administrativo
com visão geral, agenda do dia e checklist de publicação. A vitrine começa
privada e sua publicação permanece sob controle da plataforma até a ativação do
plano. As rotas usam hash para serem compartilháveis sem exigir
redirecionamentos no GitHub Pages.

As permissões públicas do Hasura expõem somente catálogo e horário comercial.
Clientes e agendamentos continuam sem escrita anônima; a confirmação persistente
será implementada com uma operação controlada no backend. Os cadastros reais de
salão usam o usuário autenticado como proprietário e as permissões do Hasura
isolam serviços, profissionais e horários por estabelecimento.

## Desenvolvimento

Requer Node.js 22.13 ou posterior.

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env.local` e informe o subdomínio e a região do
projeto Nhost. Esses dois identificadores são públicos. Admin secret, senha do
banco, tokens e connection strings nunca devem ser enviados ao navegador.

## GitHub Pages

O frontend será publicado em `https://sabion.io/belavez/`. A configuração
pública de produção está versionada em `.env.production`; credenciais não são
necessárias no build do navegador.

## Documentação

- [Plano de produto](docs/plano-de-produto.md)
- [Arquitetura e dados](docs/arquitetura-e-dados.md)
- [Decisões em aberto](docs/decisoes-em-aberto.md)
