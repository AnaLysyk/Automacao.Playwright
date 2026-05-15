import { Page } from '@playwright/test';
import { CidadaoSmartAgendamentoAutenticacaoPage } from '../pages/CidadaoSmartAgendamentoAutenticacaoPage';
import { loadEnvConfig } from '../config/env';
import { ExecutionContext } from '../types/ExecutionContext';
import { visualPause } from '../helpers/visualPause';
import { GmailCodeProvider } from '../providers/GmailCodeProvider';
import { ImapEmailCodeProvider } from '../providers/ImapEmailCodeProvider';

export class EmailCodeAgent {
  private readonly env = loadEnvConfig();
  private readonly gmailProvider = new GmailCodeProvider(this.env);
  private readonly imapProvider = new ImapEmailCodeProvider(this.env);

  /**
   * Coordena a resposta do e-mail de seguranca: captura o codigo por modo configurado,
   * preenche na tela, clica em Verificar e confirma que o Booking aceitou.
   */
  async processarCodigo(
    page: Page,
    autenticacaoPage: CidadaoSmartAgendamentoAutenticacaoPage,
    context: ExecutionContext
  ): Promise<void> {
    if (await autenticacaoPage.codigoJaValidado()) {
      context.emailCodeStatus = 'validado';
      console.log('[EMAIL-CODE] Codigo de seguranca ja estava validado na tela.');
      return;
    }

    const codigo = await this.obterCodigo(context);

    if (codigo) {
      await this.preencherEValidarCodigo(autenticacaoPage, codigo, context);
      return;
    }

    await this.obterCodigoManual(page, autenticacaoPage, context);
  }

  /**
   * Escolhe a estrategia de captura conforme EMAIL_CODE_MODE.
   * Modos seguros: manual, env, imap, gmail-api, internal-api e log autorizado.
   */
  async obterCodigo(context: ExecutionContext): Promise<string | null> {
    switch (this.env.emailCodeMode) {
      case 'env':
        return this.obterCodigoPorEnv(context);
      case 'imap':
        return this.obterCodigoPorImap(context);
      case 'gmail-api':
        return this.obterCodigoPorGmailApi(context);
      case 'internal-api':
        return this.obterCodigoPorInternalApi(context);
      case 'log':
        return this.obterCodigoPorLog(context);
      case 'manual':
      default:
        context.emailCodeStatus = 'manual';
        return null;
    }
  }

  /**
   * Le o codigo diretamente do .env.local quando EMAIL_CODE_MODE=env.
   * Use apenas em ambiente controlado, porque o valor nao deve ir para Git.
   */
  async obterCodigoPorEnv(context: ExecutionContext): Promise<string | null> {
    const codigo = this.env.securityCode?.trim();

    if (!codigo) {
      console.warn('[EMAIL-CODE] EMAIL_CODE_MODE=env, mas CIDADAO_SMART_SECURITY_CODE esta vazio.');
      return null;
    }

    console.log('[EMAIL-CODE] Codigo lido de CIDADAO_SMART_SECURITY_CODE.');
    context.emailCodeStatus = 'env';
    return codigo;
  }

  /**
   * Captura por IMAP: le a caixa de teste autorizada, extrai o codigo e responde
   * automaticamente na tela do Booking.
   */
  async obterCodigoPorImap(context: ExecutionContext): Promise<string | null> {
    context.emailCodeStatus = 'imap';
    return this.imapProvider.obterCodigoMaisRecente();
  }

  /**
   * Modo manual: a pessoa informa o codigo na tela, clica em Verificar quando preciso
   * e depois usa Resume para a automacao continuar.
   */
  async obterCodigoManual(
    page: Page,
    autenticacaoPage: CidadaoSmartAgendamentoAutenticacaoPage,
    context: ExecutionContext
  ): Promise<null> {
    console.warn('[EMAIL-CODE] Aguardando preenchimento manual do codigo de seguranca.');
    context.emailCodeStatus = 'manual';

    await visualPause(
      page,
      '[EMAIL-CODE] Preencha o codigo de seguranca no navegador. Se necessario, clique em Verificar e depois Resume.'
    );

    if (page.url().includes('/confirmacao')) {
      context.emailCodeStatus = 'validado';
      console.log('[EMAIL-CODE] Fluxo ja esta na confirmacao apos acao manual.');
      return null;
    }

    try {
      await autenticacaoPage.validarCodigoValidado();
    } catch {
      await autenticacaoPage.verificarCodigo();
      await autenticacaoPage.validarCodigoValidado();
    }

    context.emailCodeStatus = 'validado';
    return null;
  }

  /**
   * Mantem a integracao Gmail API/OAuth preparada, sem automatizar a UI do Gmail.
   */
  async obterCodigoPorGmailApi(context: ExecutionContext): Promise<string | null> {
    context.emailCodeStatus = 'gmail-api';
    return this.gmailProvider.obterCodigoMaisRecente();
  }

  /**
   * Reserva o endpoint interno de QA para quando existir contrato oficial.
   */
  async obterCodigoPorInternalApi(context: ExecutionContext): Promise<string | null> {
    context.emailCodeStatus = 'internal-api';
    console.warn('[EMAIL-CODE] EMAIL_CODE_MODE=internal-api ainda nao possui endpoint configurado.');
    return null;
  }

  /**
   * Reserva leitura de logs para uso somente com autorizacao formal do ambiente.
   */
  async obterCodigoPorLog(context: ExecutionContext): Promise<string | null> {
    context.emailCodeStatus = 'log';
    console.warn('[EMAIL-CODE] EMAIL_CODE_MODE=log exige leitura autorizada de logs e ainda nao esta implementado.');
    return null;
  }

  /**
   * Responde o desafio de e-mail: preenche, verifica e guarda o status no contexto.
   */
  private async preencherEValidarCodigo(
    autenticacaoPage: CidadaoSmartAgendamentoAutenticacaoPage,
    codigo: string,
    context: ExecutionContext
  ): Promise<void> {
    await autenticacaoPage.preencherCodigoSeguranca(codigo);
    await autenticacaoPage.verificarCodigo();
    await autenticacaoPage.validarCodigoValidado();
    context.emailCodeStatus = 'validado';
  }
}
