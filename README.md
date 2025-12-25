# Desafio de Automacao com Playwright

## Introdução
Projeto de automacao de testes **E2E (UI)** e **API** para o site https://automationexercise.com  

Desenvolvido em **JavaScript com Playwright**, usando **Page Object Model (POM)** e **massa de dados dinamica** para manter os testes **independentes, reutilizaveis e estaveis**.

## Tecnologias Utilizadas
- Node.js
- Playwright
- JavaScript 
- Page Object Model

## Instalacao 
-npm install

## Execucao dos Testes
Executar toda a suite (UI + API): npm test 
Executar apenas testes E2E (UI): npm run test:e2e
Executar apenas testes de API: npm run test:api

## Relatorio de Testes
Gerado em: playwright-report/
Visualizar: npx playwright show-report

## Estrutura do Projeto
pages/
 ├─ PaginaInicial.js
 ├─ PaginaCadastroLogin.js
 ├─ PaginaProdutos.js
 └─ PaginaCarrinho.js

tests/
 ├─ e2e/
 │   └─ automation-exercise.spec.js
 └─ api/
     └─ automation-exercise-api.spec.js

utils/
 └─ gerador-dados.js

## Cobertura dos Cenarios
Testes E2E (UI)
- Cadastro de usuario com sucesso
- Login com credenciais validas
- Login com credenciais invalidas
- Busca de produtos
- Adicao de produtos ao carrinho e validacao de valores

Testes de API
- Listagem de todos os produtos
- Busca de produto por nome
- Busca de produto sem informar parametro
- Validacao de login via API com credenciais validas

## Boas Praticas Aplicadas
- Uso de Page Object Model (POM) para organizacao e reutilizacao
- Separacao clara entre logica de teste e massa de dados
- Seletores estaveis priorizando: `data-qa`, `id`, roles de acessibilidade
- Dados dinamicos (nome, email, senha e data de nascimento unicos a cada execucao)
- Testes independentes, capazes de rodar isoladamente
- Sem uso de `waitForTimeout` ou esperas artificiais

## Observacoes Importantes
- O site Automation Exercise e publico e pode apresentar lentidao.
- Timeouts e retries ajustados em `playwright.config.js` para estabilidade sem mascarar problemas reais.
- Todos os testes estao em portugues, com nomes claros e padronizados.

## Autora
Projeto desenvolvido por Ana Lysyk 
