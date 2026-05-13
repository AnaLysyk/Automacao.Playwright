# Planner - Emissao Captura

## Interpretacao da solicitacao

Planejar testes da tela de captura de emissao online, com foco em upload de foto valido, ajuste e controle de prosseguimento.

## Saida obrigatoria

Gerar plano em specs/emissao-captura.plan.md com:
- escopo
- pre-condicoes
- cenarios positivos e negativos
- validacoes de interface
- dependencias de arquivo de imagem

## Regras

- nao usar camera como caminho principal da automacao
- usar upload por file chooser ou setInputFiles
- se houver bloqueio de ambiente, registrar como bloqueado e nao mascarar falha
