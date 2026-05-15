# API Cidadao Smart

Testes de integracao das APIs publicas ou internas do Cidadao Smart.

Objetivo: validar contratos, status, payloads e disponibilidade sem depender da UI.

## Cobertura atual

- Token Keycloak quando credenciais estiverem configuradas.
- Consulta de protocolo inexistente.
- Consulta de protocolo existente quando `API_VALID_PROTOCOL` estiver configurado.
- Validacoes negativas de abertura de processo, segunda via, via expressa e DAE.
- Abertura de segunda via expressa somente com `API_WRITE_ENABLED=true`.
