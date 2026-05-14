# Run 003 - Confirmacao por Email

Objetivo: preparar etapa de leitura do codigo de seguranca via Gmail API (sem UI do Gmail).

Estado atual:
- Codigo vem de CIDADAO_SMART_SECURITY_CODE.

Proxima etapa tecnica:
1. Criar projeto no Google Cloud.
2. Ativar Gmail API.
3. Configurar OAuth para conta de teste.
4. Ler ultimo email por query (newer_than + subject + destinatario).
5. Extrair codigo por regex de 6 digitos.

Regra:
- Nao automatizar login/tela do Gmail no browser.
