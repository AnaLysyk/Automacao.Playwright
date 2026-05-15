import { ImapFlow } from 'imapflow';

declare const process: { env: Record<string, string | undefined> };

type OpcoesObterCodigo = {
  inicioFluxo?: Date;
};

const DEFAULT_CODE_REGEX = '\\b(\\d{6})\\b';

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  return ['1', 'true', 'yes', 'sim'].includes(value.trim().toLowerCase());
}

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buscarCodigoViaImap(inicioFluxo?: Date): Promise<string> {
  const host = process.env.CIDADAO_SMART_EMAIL_IMAP_HOST;
  const port = parseNumber(process.env.CIDADAO_SMART_EMAIL_IMAP_PORT, 993);
  const secure = parseBoolean(process.env.CIDADAO_SMART_EMAIL_IMAP_SECURE, true);
  const user = process.env.CIDADAO_SMART_EMAIL_IMAP_USER;
  const password = process.env.CIDADAO_SMART_EMAIL_IMAP_PASSWORD;
  const mailbox = process.env.CIDADAO_SMART_EMAIL_IMAP_MAILBOX || 'INBOX';
  const fromFilter = process.env.CIDADAO_SMART_EMAIL_FROM_FILTER?.trim().toLowerCase();
  const regexStr = process.env.CIDADAO_SMART_EMAIL_CODE_REGEX || DEFAULT_CODE_REGEX;
  const timeoutMs = parseNumber(process.env.CIDADAO_SMART_EMAIL_POLL_TIMEOUT_MS, 120_000);
  const intervalMs = parseNumber(process.env.CIDADAO_SMART_EMAIL_POLL_INTERVAL_MS, 5_000);

  if (!host || !user || !password) {
    throw new Error(
      'Configure CIDADAO_SMART_EMAIL_IMAP_HOST, CIDADAO_SMART_EMAIL_IMAP_USER e CIDADAO_SMART_EMAIL_IMAP_PASSWORD para usar o modo imap.'
    );
  }

  const codeRegex = new RegExp(regexStr, 'm');
  const inicioBusca = Date.now();
  const dataReferencia = inicioFluxo || new Date(Date.now() - 5 * 60_000);

  const client = new ImapFlow({
    host,
    port,
    secure,
    auth: { user, pass: password },
  });

  await client.connect();

  try {
    await client.mailboxOpen(mailbox);

    while (Date.now() - inicioBusca <= timeoutMs) {
      const uidsResult = await client.search({ since: dataReferencia }, { uid: true });
      const uids = Array.isArray(uidsResult) ? uidsResult : [];
      const ordered = [...uids].sort((a, b) => b - a);

      for (const uid of ordered) {
        const msg = await client.fetchOne(uid, { envelope: true, source: true, internalDate: true }, { uid: true });
        if (!msg || !('source' in msg) || !msg.source) continue;

        if (msg.internalDate && msg.internalDate < dataReferencia) {
          continue;
        }

        if (fromFilter) {
          const rems = msg.envelope?.from || [];
          const emailFrom = rems
            .map((f: { address?: string }) => f.address || '')
            .join(' ')
            .toLowerCase();

          if (!emailFrom.includes(fromFilter)) {
            continue;
          }
        }

        const sourceAsText = msg.source.toString('utf8');
        const found = sourceAsText.match(codeRegex);
        if (found) {
          return (found[1] || found[0]).trim();
        }
      }

      await esperar(intervalMs);
    }
  } finally {
    await client.logout().catch(() => undefined);
  }

  throw new Error('Nao foi possivel localizar codigo de seguranca no e-mail dentro do tempo limite.');
}

export async function obterCodigoSegurancaParaAutenticacao(opcoes?: OpcoesObterCodigo): Promise<string> {
  const source = (process.env.CIDADAO_SMART_SECURITY_CODE_SOURCE || 'env').trim().toLowerCase();

  if (source === 'env') {
    const codigo = process.env.CIDADAO_SMART_SECURITY_CODE?.trim();
    if (!codigo) {
      throw new Error('Defina CIDADAO_SMART_SECURITY_CODE para usar CIDADAO_SMART_SECURITY_CODE_SOURCE=env.');
    }
    return codigo;
  }

  if (source === 'imap') {
    return buscarCodigoViaImap(opcoes?.inicioFluxo);
  }

  throw new Error('Valor invalido para CIDADAO_SMART_SECURITY_CODE_SOURCE. Use env ou imap.');
}
