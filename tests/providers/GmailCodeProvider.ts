import { EnvConfig } from '../config/env';

export class GmailCodeProvider {
  constructor(private readonly env: EnvConfig) {}

  /**
   * Eu busco o código mais recente usando Gmail API quando OAuth estiver configurado.
   */
  async obterCodigoMaisRecente(): Promise<string | null> {
    if (!this.possuiConfiguracaoMinima()) {
      console.warn('[GMAIL] Configuração OAuth ausente. Configure GMAIL_CREDENTIALS_PATH e GMAIL_TOKEN_PATH em .env.local.');
      return null;
    }

    console.warn('[GMAIL] Provider base criado. A chamada real da Gmail API/OAuth será implementada quando as credenciais de QA forem aprovadas.');
    return null;
  }

  /**
   * Eu represento a futura busca da mensagem mais recente na caixa de teste.
   */
  async buscarMensagemMaisRecente(): Promise<unknown | null> {
    console.warn('[GMAIL] Busca real de mensagens ainda não implementada.');
    return null;
  }

  /**
   * Eu represento a futura leitura do corpo de uma mensagem pelo id retornado pela Gmail API.
   */
  async obterConteudoMensagem(messageId: string): Promise<string> {
    console.warn(`[GMAIL] Leitura real da mensagem ${messageId} ainda não implementada.`);
    return '';
  }

  /**
   * Eu extraio o código do texto do e-mail usando regex configurável.
   */
  extrairCodigo(conteudo: string): string | null {
    const regex = new RegExp(this.env.gmailCodeRegex);
    const match = conteudo.match(regex);

    return match?.[0] || null;
  }

  /**
   * Eu valido se já existem caminhos mínimos para ativar Gmail API/OAuth.
   */
  private possuiConfiguracaoMinima(): boolean {
    return Boolean(this.env.gmailCredentialsPath && this.env.gmailTokenPath);
  }
}
