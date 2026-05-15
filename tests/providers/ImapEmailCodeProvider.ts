import { ImapFlow } from 'imapflow';
import { EnvConfig } from '../config/env';

type MensagemCodigo = {
  uid: number;
  conteudo: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ImapEmailCodeProvider {
  constructor(private readonly env: EnvConfig) {}

  /**
   * Captura o codigo mais recente na caixa de e-mail de teste usando IMAP.
   * Este caminho nao abre Gmail/Outlook no navegador; ele usa somente credenciais
   * autorizadas em .env.local e nunca imprime usuario, senha ou conteudo do e-mail.
   */
  async obterCodigoMaisRecente(): Promise<string | null> {
    if (!this.possuiConfiguracaoMinima()) {
      console.warn('[EMAIL-IMAP] Configuracao IMAP ausente. Use EMAIL_CODE_MODE=manual ou configure a caixa de QA.');
      return null;
    }

    const deadline = Date.now() + this.env.emailPollTimeoutMs;

    while (Date.now() <= deadline) {
      const mensagem = await this.buscarMensagemMaisRecente();
      const codigo = mensagem ? this.extrairCodigo(mensagem.conteudo) : null;

      if (codigo) {
        console.log(`[EMAIL-IMAP] Codigo capturado da mensagem UID ${mensagem?.uid}.`);
        return codigo;
      }

      await sleep(this.env.emailPollIntervalMs);
    }

    console.warn('[EMAIL-IMAP] Timeout aguardando codigo de seguranca na caixa de teste.');
    return null;
  }

  /**
   * Busca as mensagens recentes em ordem inversa para priorizar o e-mail recem-enviado
   * pelo Booking. A busca fica limitada por data e remetente quando configurado.
   */
  private async buscarMensagemMaisRecente(): Promise<MensagemCodigo | null> {
    const client = new ImapFlow({
      host: this.env.imapHost as string,
      port: this.env.imapPort,
      secure: this.env.imapSecure,
      auth: {
        user: this.env.imapUser as string,
        pass: this.env.imapPassword as string,
      },
      logger: false,
    });

    await client.connect();

    const lock = await client.getMailboxLock(this.env.imapMailbox);
    try {
      const since = new Date(Date.now() - this.env.emailPollTimeoutMs - 60_000);
      const searchQuery = this.env.imapFromFilter
        ? { since, from: this.env.imapFromFilter }
        : { since };
      const uids = await client.search(searchQuery, { uid: true });

      if (!uids || uids.length === 0) {
        return null;
      }

      for (const uid of [...uids].sort((a, b) => b - a)) {
        const message = await client.fetchOne(String(uid), { source: true }, { uid: true });
        const conteudo = message && message.source ? message.source.toString('utf-8') : '';

        if (this.extrairCodigo(conteudo)) {
          return { uid, conteudo };
        }
      }

      return null;
    } finally {
      lock.release();
      await client.logout().catch(() => undefined);
    }
  }

  /**
   * Extrai apenas o codigo numerico esperado; isso evita salvar ou exibir o corpo
   * completo do e-mail nas evidencias.
   */
  private extrairCodigo(conteudo: string): string | null {
    const regex = new RegExp(this.env.emailCodeRegex);
    const match = conteudo.match(regex);
    return match?.[1] || match?.[0] || null;
  }

  private possuiConfiguracaoMinima(): boolean {
    return Boolean(this.env.imapHost && this.env.imapUser && this.env.imapPassword);
  }
}
