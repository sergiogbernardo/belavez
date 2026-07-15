# Arquitetura e dados

## Visão geral

O frontend estático é servido pelo GitHub Pages. Autenticação, banco relacional
e atualizações em tempo real ficam no Supabase. O navegador utiliza apenas a
chave publishable; autorização real é aplicada no PostgreSQL por RLS.

## Isolamento multi-tenant

`salons` é a raiz de cada espaço. Toda tabela operacional carrega `salon_id` e
só pode ser acessada por um vínculo ativo em `salon_memberships`. Ser
proprietário de um salão não concede qualquer acesso a outro.

## Entidades iniciais

| Entidade | Papel |
| --- | --- |
| `profiles` | Dados mínimos associados ao usuário autenticado |
| `salons` | Estabelecimentos atendidos pela plataforma |
| `salon_memberships` | Papel de cada usuário dentro de cada salão |
| `professionals` | Profissionais que recebem agendamentos |
| `services` | Serviços, duração, preço e estado de publicação |
| `professional_services` | Quais profissionais executam cada serviço |
| `business_hours` | Horário recorrente do estabelecimento |
| `availability_blocks` | Folgas, pausas e bloqueios excepcionais |
| `clients` | Cadastro de clientes isolado por salão |
| `appointments` | Reserva, período, estado e responsáveis |

## Regra crítica de concorrência

Dois clientes não podem reservar o mesmo profissional em períodos
sobrepostos. Essa garantia deve existir no banco, e não apenas na interface.
Uma constraint de exclusão sobre o intervalo do agendamento protegerá contra
cliques simultâneos e múltiplos dispositivos.

## Agendamento público

O acesso anônimo nunca terá permissão ampla de inserção nas tabelas. A página
pública deverá chamar uma função controlada que valide salão, serviço,
profissional, disponibilidade, limite de tentativas e dados mínimos. A leitura
pública também será limitada ao catálogo publicado e a horários calculados,
sem expor nomes ou telefones de clientes.

## Privacidade

- coletar somente nome e um canal de contato necessário à reserva;
- nunca exibir a agenda completa ou dados de outros clientes ao público;
- registrar alterações importantes numa trilha de auditoria;
- definir retenção e exclusão antes da abertura comercial;
- separar consentimento de marketing da execução do agendamento.

