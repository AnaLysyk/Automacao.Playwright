import dotenv from 'dotenv';
import { ImapFlow } from 'imapflow';

dotenv.config({ path: '.env.local' });
dotenv.config();

function readNumber(name: string, fallback: number): number {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  if (!value) return fallback;
  return ['1', 'true', 'yes', 'sim'].includes(value);
}

async function main(): Promise<void> {
  const host = process.env.CIDADAO_SMART_EMAIL_IMAP_HOST;
  const port = readNumber('CIDADAO_SMART_EMAIL_IMAP_PORT', 993);
  const secure = readBoolean('CIDADAO_SMART_EMAIL_IMAP_SECURE', true);
  const user = process.env.CIDADAO_SMART_EMAIL_IMAP_USER;
  const pass = process.env.CIDADAO_SMART_EMAIL_IMAP_PASSWORD;
  const mailbox = process.env.CIDADAO_SMART_EMAIL_IMAP_MAILBOX || 'INBOX';

  const missing = [
    ['CIDADAO_SMART_EMAIL_IMAP_HOST', host],
    ['CIDADAO_SMART_EMAIL_IMAP_USER', user],
    ['CIDADAO_SMART_EMAIL_IMAP_PASSWORD', pass],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`[EMAIL-QA] Variaveis ausentes no .env.local: ${missing.join(', ')}`);
  }

  const client = new ImapFlow({
    host: host as string,
    port,
    secure,
    auth: {
      user: user as string,
      pass: pass as string,
    },
    logger: false,
  });

  await client.connect();

  try {
    const status = await client.status(mailbox, { messages: true, unseen: true });
    console.log('[EMAIL-QA] Caixa QA acessivel por IMAP.');
    console.log(`[EMAIL-QA] Conta: ${user}`);
    console.log(`[EMAIL-QA] Mailbox: ${mailbox}`);
    console.log(`[EMAIL-QA] Mensagens: ${status.messages ?? 0}`);
    console.log(`[EMAIL-QA] Nao lidas: ${status.unseen ?? 0}`);
    console.log('[EMAIL-QA] Configure EMAIL_CODE_MODE=imap para capturar codigo automaticamente.');
  } finally {
    await client.logout().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
