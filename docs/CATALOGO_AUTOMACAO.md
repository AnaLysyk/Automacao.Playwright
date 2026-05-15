# Catalogo da automacao

Este catalogo ajuda a comparar fluxo, spec, comando e status.

| Fluxo | Tipo | Pasta | Spec | Comando | Status | Observacao |
|---|---|---|---|---|---|---|
| Smoke da home | regressao | `tests/smoke` | `cidadao-smart-home-smoke.spec.ts` | `npm run test:smoke` | ok | valida resposta basica da home |
| Agendamento publico | regressao | `tests/booking/public` | `cidadao-smart-agendamento-presencial.spec.ts` | `npm run test:booking:public` | em estabilizacao | pode depender de ambiente/CAPTCHA controlado |
| Agendamento validacoes | regressao | `tests/booking/public` | `cidadao-smart-agendamento-validacoes.spec.ts` | `npm run test:agendamento:validacoes` | em estabilizacao | regras de dados do requerente |
| Agendamento assistido | assistido | `tests/booking/manual-assisted/agendamento-presencial` | `booking-agendamento-assistido.spec.ts` | `npm run test:booking:assistido` | manual | pausa para CAPTCHA/codigo quando necessario |
| Emissao online | regressao | `tests/cidadao-smart/emissao-online/regressao` | `cidadao-smart-emissao-*.spec.ts` | `npm run test:emissao` | ok | regressao controlada |
| Consulta de pedido/agendamento | regressao | `tests/cidadao-smart/consulta-pedido` | `cidadao-smart-consulta-*.spec.ts` | `npm run test:consulta` | ok/parcial | consulta com massa valida quando existir |
| 2a via regressao | regressao | `tests/cidadao-smart/segunda-via/regressao` | `cidadao-smart-2via-*.spec.ts` | `npm run test:2via` | em estabilizacao | sem intervencao humana obrigatoria |
| 2a via expressa encadeada | assistido | `tests/cidadao-smart/segunda-via/manual-assisted` | `2via-expressa-protocolo-finalizado.spec.ts` | `npm run test:2via:expressa:encadeada` | aprovado | gera protocolo e evidencia |
| 2a via alteracao de nome | assistido | `tests/cidadao-smart/segunda-via/manual-assisted` | `2via-alteracao-nome.spec.ts` | `npm run test:2via:alteracao-nome` | em estabilizacao | depende de fluxo/manual-assisted |
| Booking Admin read-only | regressao/read-only | `tests/booking/admin/read-only` | `smoke-*.spec.ts` | `npm run test:admin:readonly` | verificar ambiente | nao deve alterar estado |
| Booking Admin write | assistido/write | `tests/booking/admin/write` | futura spec | `npm run test:admin:write` | controlado | usar so em QA |
| API smoke/notifier | regressao/API | `tests/api` | `api-smoke.spec.ts`, `cidadao-smart-notificador-gbds.spec.ts` | `npm run test:api` | verificar ambiente | separar por dominio em etapa futura |
| E2E automatizado | regressao/e2e | `tests/e2e/automated` | `*.spec.ts` | `npm run test:e2e` | em estabilizacao | pode depender de agenda/massa |
| E2E assistido demo | assistido | `tests/e2e/manual-assisted` | `cidadao-smart-demo-*.spec.ts` | `npm run test:demo` | manual | demos e pausas |
| SMART read-only | regressao/read-only | `tests/smart/read-only` | `smoke-smart.spec.ts` | `npx playwright test tests/smart/read-only --project=chromium` | verificar credenciais | consulta e smoke |
| SMART finalizar | assistido/write | `tests/smart/write` | `smart-finalizar-protocolo-gerado.spec.ts` | `npm run test:smart:finalizar` | controlado | altera estado do processo |
| Captura fake video | POC | `tests/poc/captura` | `captura-fake-video.spec.ts` | `npm run test:captura:poc` | experimental | prova de conceito |

