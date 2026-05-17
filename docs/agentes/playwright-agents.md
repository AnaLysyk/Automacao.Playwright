# Playwright Agents no Projeto

Este documento explica como os agentes relacionados ao Playwright podem ser usados neste projeto de automação.

A ideia não é substituir os testes automatizados. A ideia é usar agentes para ajudar em tarefas como:

- explorar tela;
- mapear fluxo;
- gerar plano de teste;
- criar primeira versão de teste;
- sugerir correções em teste UI quebrado;
- apoiar investigação técnica.

A validação oficial continua sendo feita pelo Playwright Test.

---

## Regra principal

No projeto, a regra é:

```txt
Agente ajuda.
Playwright executa.
Relatório comprova.