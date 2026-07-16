# BelaVez

**Seu salão, no tempo certo.**

Plataforma de agendamento para salões, barbearias, estúdios de unhas, estética
e outros negócios de beleza. Cada estabelecimento administra sua equipe,
serviços, disponibilidade e clientes em um espaço isolado, enquanto o público
agenda por uma página própria do negócio.

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

A página pública já possui um fluxo responsivo de demonstração com escolha de
serviço, profissional, data, horário, identificação do cliente, resumo e
conclusão. O catálogo tenta carregar dados publicados pelo Hasura e usa o Ateliê
Aurora como exemplo enquanto nenhum salão real estiver cadastrado.

As permissões públicas do Hasura expõem somente catálogo e horário comercial.
Clientes e agendamentos continuam sem escrita anônima; a confirmação persistente
será implementada com uma operação controlada no backend.

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
