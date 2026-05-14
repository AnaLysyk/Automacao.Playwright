# Ambientes e Acessos — Contexto Funcional

## 1. Objetivo do documento

Este documento descreve os ambientes utilizados para validação dos produtos SMART, Cidadão Smart, Booking e serviços relacionados.

O objetivo é centralizar a visão de:

- quais ambientes existem;
- para que cada ambiente é usado;
- quais URLs são relevantes;
- quais sistemas rodam em cada máquina;
- quais cuidados precisam ser tomados ao executar testes;
- quais dados devem ficar fora do repositório;
- como organizar variáveis de ambiente para automação.

Este documento não deve conter senhas, tokens, chaves privadas, credenciais reais, códigos de segurança reais ou dados sensíveis.

---

## 2. Regra de segurança

Credenciais reais não devem ser registradas neste repositório.

Não commitar:

- senha de VPN;
- senha de usuário admin;
- senha de usuário operador;
- senha de root;
- token Bearer;
- chave privada SSH;
- código real de segurança;
- prints de gerenciador de senha;
- dados pessoais sensíveis.

Essas informações devem ficar em:

- gerenciador de senhas;
- cofre corporativo;
- `.env.local`;
- variáveis locais de ambiente;
- ferramenta segura definida pelo time.

Arquivos `.env`, `.env.local` e diretórios de autenticação devem estar no `.gitignore`.

Exemplo:

```txt
.env
.env.local
playwright/.auth
*.pem
*.key
```

## 3. Visão geral dos ambientes

Atualmente existem ambientes usados com finalidades diferentes.

### 3.1 Ambiente 146

O ambiente 172.16.1.146 é usado como ambiente de desenvolvimento/homologação para validações em andamento.

Esse ambiente pode receber alterações novas, ajustes de release, correções e experimentações.

Uso esperado:

- desenvolvimento;
- homologação;
- reteste;
- automação assistida;
- investigação de bugs;
- validação de fluxos novos;
- testes exploratórios;
- testes com massa controlada.

Cuidados:

- pode estar instável;
- pode ter mudanças recentes;
- pode ter configuração diferente do ambiente 201;
- pode depender de VPN;
- pode exigir ignore de HTTPS no Playwright;
- pode ter dados de agenda/posto em alteração.

### 3.2 Ambiente 201

O ambiente 172.16.1.201 representa um ambiente mais próximo de produção ou produção operacional, conforme contexto atual do projeto.

Uso esperado:

- comparação com comportamento produtivo;
- validações mais conservadoras;
- conferência de comportamento existente;
- investigação de divergência entre DEV/HML e produção.

Cuidados:

- evitar testes destrutivos;
- não alterar configuração sem autorização;
- não rodar automações de escrita sem alinhamento;
- priorizar testes read-only;
- evitar criação massiva de dados;
- registrar evidência antes de qualquer ação sensível.

### 3.3 Ambiente 172.16.0.200

O ambiente 172.16.0.200 é citado em contextos relacionados a GBDS/MIR e acessos auxiliares.

Uso esperado:

- validações relacionadas a GBDS;
- consultas auxiliares;
- suporte a investigações;
- acesso a módulos complementares.

Cuidados:

- validar objetivo antes de executar teste;
- não misturar contexto do MIR/GBDS com Booking sem necessidade;
- documentar quando uma investigação depender desse ambiente.

## 4. URLs relevantes

### 4.1 Ambiente 146

URLs conhecidas:

- https://172.16.1.146/admin/login
- https://172.16.1.146/agendamentos
- http://172.16.1.146:8100/react

Possíveis usos:

- /admin/login: acesso administrativo do Booking;
- /agendamentos: jornada pública de agendamento no Cidadão Smart/Booking;
- :8100/react: interface SMART/GBDS relacionada ao ambiente.

### 4.2 Ambiente 201

URLs conhecidas:

- https://172.16.1.201/admin/login
- http://172.16.1.201:8100/react
- https://172.16.1.201/

Possíveis usos:

- /admin/login: acesso administrativo do Booking;
- :8100/react: interface SMART/GBDS relacionada ao ambiente;
- raiz HTTPS: acesso principal do ambiente.

### 4.3 Observação sobre HTTPS

Algumas URLs usam certificado interno/autossinalado.

Na automação Playwright, pode ser necessário:

```typescript
ignoreHTTPSErrors: true
```

Isso deve ser documentado no playwright.config.ts.

## 5. Produtos e sistemas envolvidos

Os ambientes podem envolver os seguintes produtos ou módulos:

- SMART;
- Booking;
- Cidadão Smart;
- PRINT;
- GBDS;
- MIR;
- Notificador GBDS;
- Painel Administrativo;
- APIs de integração.

A automação deve deixar claro qual produto está sendo testado em cada suíte.

## 6. Responsabilidade por ambiente

### 6.1 Ambiente 146

Recomendado para:

- testes automatizados em construção;
- automação assistida;
- ajustes de selectors;
- validação de fluxo Booking/Cidadão;
- testes de API em homologação;
- testes de painel admin read-only;
- testes de escrita apenas com autorização.

### 6.2 Ambiente 201

Recomendado para:

- comparação de comportamento;
- validações read-only;
- checagens pontuais;
- confirmação de comportamento produtivo.

Não recomendado para:

- testes destrutivos;
- alteração de configuração;
- criação massiva de dados;
- automação write sem autorização.

## 7. Perfis de acesso

Os acessos podem envolver perfis diferentes, como:

- administrador;
- operador;
- supervisor;
- usuário técnico;
- usuário de integração;
- usuário VPN;
- usuário SSH.

Cada perfil pode ter permissões diferentes.

A automação deve considerar que o comportamento visual e funcional pode mudar conforme o perfil.

Exemplos:

- operador pode visualizar uma ação, mas não conseguir salvar;
- administrador pode aprovar alterações;
- supervisor pode criar alteração que exige auditoria;
- usuário sem permissão deve ser bloqueado ou redirecionado.

Credenciais reais desses perfis não devem ficar neste documento.

## 8. Variáveis de ambiente recomendadas

Criar um .env.local para execução local.

Exemplo sem valores sensíveis:

```bash
# Ambiente principal
TARGET_ENV=146

# Cidadão Smart / Booking
CIDADAO_SMART_BASE_URL=https://172.16.1.146
BOOKING_ADMIN_BASE_URL=https://172.16.1.146/admin/login
SMART_REACT_URL=http://172.16.1.146:8100/react

# Execução
CAPTCHA_MODE=manual
EXECUTION_MODE=manual-assisted
PW_SLOW_MO=300

# Código de segurança
CIDADAO_SMART_SECURITY_CODE=

# Admin Booking
BOOKING_ADMIN_USER=
BOOKING_ADMIN_PASSWORD=

# API
API_BASE_URL=
API_TOKEN=

# Evidências
EVIDENCE_DIR=test-results
```

Para ambiente 201, usar outro arquivo local ou alterar variáveis:

```bash
TARGET_ENV=201
CIDADAO_SMART_BASE_URL=https://172.16.1.201
BOOKING_ADMIN_BASE_URL=https://172.16.1.201/admin/login
SMART_REACT_URL=http://172.16.1.201:8100/react
```

## 9. Configuração por ambiente

A automação deve permitir escolher o ambiente sem alterar código.

Exemplo de uso esperado:

```bash
$env:TARGET_ENV="146"
npm run test:booking:assistido
```

ou:

```bash
$env:TARGET_ENV="201"
npm run test:admin:readonly
```

O código deve ler URLs e credenciais via variável de ambiente.

Não deve existir URL fixa espalhada nas specs.

## 10. Playwright e execução visual

Para fluxos assistidos, a execução deve ser visual.

Configuração recomendada:

- browser aberto;
- slowMo;
- screenshot em falha;
- vídeo em falha;
- trace em retry ou quando configurado;
- relatório HTML.

Exemplo conceitual:

```typescript
use: {
  ignoreHTTPSErrors: true,
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
  launchOptions: {
    slowMo: Number(process.env.PW_SLOW_MO || 0),
  },
}
```

Fluxos com CAPTCHA e código por e-mail devem ser classificados como manual-assisted.

## 11. CAPTCHA e código por e-mail

Alguns fluxos do Booking/Cidadão Smart possuem barreiras externas:

- CAPTCHA;
- código de segurança enviado por e-mail.

Essas barreiras não invalidam a automação.

Enquanto não existir bypass controlado de QA ou integração com serviço de e-mail, o fluxo pode ser executado como automação assistida.

### 11.1 Estratégia atual

**CAPTCHA:**

- usar page.pause();
- resolver manualmente;
- continuar com Resume.

**Código por e-mail:**

- informar manualmente durante a execução;
- ou usar variável temporária em .env.local, quando aplicável.

### 11.2 Estratégia futura

Avaliar alternativas controladas:

- CAPTCHA desabilitado em ambiente QA;
- chave de teste para CAPTCHA;
- flag de ambiente;
- endpoint interno para recuperar código;
- Gmail API/OAuth para caixa de teste;
- mock/fake provider de e-mail em homologação;
- leitura controlada de logs, quando autorizado.

Não burlar CAPTCHA real.

## 12. Postman / API / Collections

Há contexto de collection de API com ambiente ativo 146:8100.

Informações relevantes:

- ambiente ativo: 146:8100;
- variáveis esperadas: baseUrl, validCPF, invalidCPF;
- autenticação: Bearer Token;
- token deve ser configurado de forma segura;
- token não deve ser commitado;
- requisições podem usar path variables, como número de processo;
- requests podem depender de Content-Type: application/json.

Exemplo de request mapeada:

- Método: PUT
- Endpoint: {{baseUrl}}/api/processos/:nsp/status
- Path variable: nsp
- Body: {"data":{"status":19}}
- Autenticação: Bearer Token

Cuidados:

- garantir que token esteja configurado antes de executar;
- não versionar token;
- separar ambiente 146 de 201;
- não executar alteração de status em ambiente produtivo sem autorização.

## 13. Acesso SSH e comandos de investigação

Algumas investigações podem exigir acesso ao servidor.

Exemplos de uso:

- consultar logs;
- verificar arquivos de impressão;
- enviar imagens para checkprint;
- consultar PDFs gerados;
- reiniciar serviços em ambiente controlado;
- alterar configuração apenas com autorização.

Comandos e caminhos podem ser documentados, mas senhas não.

Exemplos de comandos permitidos como referência:

```bash
integrationlogt -n10000 | grep "TERMO_BUSCADO" -A10
```

Explicação:

- -n10000: define quantidade de linhas recentes analisadas;
- grep: filtra pelo termo buscado;
- -A10: exibe linhas após a ocorrência encontrada.

Outros comandos citados em contexto operacional:

- printlogt
- mirlogt
- docker logs gbs-trust-bff

Uso de scp pode ser necessário para mover arquivos de evidência ou massa técnica, como imagens de checkprint.

Credenciais e chaves privadas não devem ser documentadas.

## 14. PRINT e evidências de impressão

O ambiente pode conter fluxos relacionados ao PRINT.

Possíveis caminhos operacionais:

- /var/spool/cups-pdf/ANONYMOUS
- /var/lib/tomcats/print/checkprint/

Usos:

- verificar PDFs gerados;
- coletar evidência de impressão;
- enviar imagens para checagem de impressão;
- validar comportamento de checkprint.

Essas rotinas pertencem a contexto operacional e devem ficar separadas dos testes de Booking quando não forem parte direta do fluxo de agendamento.

## 15. Troca de UF / configuração de ambiente

Alguns testes podem depender da UF configurada no ambiente.

Exemplo de configuração citada:

- biographic.preferredUF=SC
- biographic.preferredUF=TO

Esse tipo de alteração impacta diretamente o comportamento do SMART/Cidadão/Booking.

Cuidados:

- não alterar UF sem autorização;
- registrar antes/depois;
- reiniciar serviços somente quando permitido;
- não rodar testes automatizados assumindo UF fixa sem validar ambiente;
- documentar a UF usada na execução.

## 16. Flags e propriedades relevantes

Algumas propriedades podem impactar fluxos testados.

Exemplos:

- scintegration.mandatoryConference=false
- print-polycarbonate.enabled=false

Essas flags devem ser tratadas como contexto de ambiente.

A automação deve registrar quando um comportamento esperado depende de configuração específica.

## 17. Evidências e relatórios

A automação deve gerar evidências para facilitar análise.

Tipos esperados:

- screenshot;
- vídeo;
- trace;
- relatório HTML;
- logs relevantes;
- resumo da execução;
- dados principais usados na execução;
- ambiente utilizado;
- URL base;
- data/hora;
- status final.

Estrutura recomendada:

```
test-results/
  booking/
  booking-admin/
  api/
  manual-assisted/
  screenshots/
  videos/
  traces/
```

Relatório HTML:

```bash
npx playwright show-report
```

## 18. Classificação de falhas por ambiente

Quando um teste falhar, a análise deve classificar a causa provável.

Categorias sugeridas:

- falha de produto;
- falha de automação;
- falha de ambiente;
- falha de configuração;
- falha de massa;
- falha de permissão;
- falha de integração;
- falha por known issue;
- bloqueio por CAPTCHA;
- bloqueio por código de e-mail;
- bloqueio por agenda indisponível.

Essa classificação ajuda a evitar que todo erro seja tratado automaticamente como bug do produto.

## 19. O que não deve ficar neste documento

Este documento não deve conter:

- senha real;
- token real;
- chave privada;
- CPF sensível;
- código de segurança real;
- print de gerenciador de senha;
- credencial de VPN;
- credencial de root;
- dados pessoais não necessários;
- execução detalhada de caso de teste;
- selectors Playwright;
- implementação técnica.

## 20. Relação com outros documentos

Este documento se relaciona com:

- context/requirements/visao-geral.md
- context/requirements/agendamento-presencial.md
- context/requirements/booking-admin.md
- context/requirements/api-cidadao-booking.md
- context/requirements/known-issues.md
- context/requirements/regras-criticas.md
- docs/GUIA_DE_EXECUCAO.md
- docs/EVIDENCIAS_E_RELATORIOS.md
- docs/GUIA_DE_ANALISE_DE_FALHAS.md

## 21. Status deste documento

Este documento é um contexto de ambientes e acessos.

Ele deve ser atualizado quando:

- novo ambiente for adicionado;
- URL mudar;
- porta mudar;
- comportamento entre 146 e 201 mudar;
- nova dependência de ambiente for identificada;
- nova variável de ambiente for necessária;
- nova estratégia para CAPTCHA ou código por e-mail for definida;
- novo padrão de evidência for adotado.

Alterações de senha, token ou credencial não devem ser registradas aqui.
