import { Page } from '@playwright/test';
import { CidadaoSmartAgendamentoAutenticacaoPage } from '../pages/CidadaoSmartAgendamentoAutenticacaoPage';
import { loadEnvConfig } from '../config/env';
import { ExecutionContext } from '../types/ExecutionContext';
import { visualPause } from '../helpers/visualPause';
import { GmailCodeProvider } from '../providers/GmailCodeProvider';

export class EmailCodeAgent {
  private readonly env = loadEnvConfig();
  private readonly gmailProvider = new GmailCodeProvider(this.env);

  /**
   * Eu coordeno a obtenção do código e o preenchimento na tela de autenticação.
   */
  async processarCodigo(
    page: Page,
    autenticacaoPage: CidadaoSmartAgendamentoAutenticacaoPage,
    context: ExecutionContext
  ): Promise<void> {
    const codigo = await this.obterCodigo(context);

    if (codigo) {
      await this.preencherEValidarCodigo(autenticacaoPage, codigo, context);
      return;
    }

    await this.obterCodigoManual(page, autenticacaoPage, context);
  }

  /**
   * Eu escolho a estratégia de código conforme EMAIL_CODE_MODE.
   */
  async obterCodigo(context: ExecutionContext): Promise<string | null> {
    switch (this.env.emailCodeMode) {
      case 'env':
        return this.obterCodigoPorEnv(context);
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
   * Eu leio o código diretamente do .env.local quando EMAIL_CODE_MODE=env.
   */
  async obterCodigoPorEnv(context: ExecutionContext): Promise<string | null> {
    const codigo = this.env.securityCode?.trim();

    if (!codigo) {
      console.warn('[EMAIL-CODE] EMAIL_CODE_MODE=env, mas CIDADAO_SMART_SECURITY_CODE está vazio.');
      return null;
    }

    console.log('[EMAIL-CODE] Código lido de CIDADAO_SMART_SECURITY_CODE.');
    context.emailCodeStatus = 'env';
    return codigo;
  }

  /**
   * Eu preparo o modo manual, pausando para a pessoa informar o código na tela.
   */
  async obterCodigoManual(
    page: Page,
    autenticacaoPage: CidadaoSmartAgendamentoAutenticacaoPage,
    context: ExecutionContext
  ): Promise<null> {
    console.warn('[EMAIL-CODE] Aguardando preenchimento manual do código de segurança.');
    context.emailCodeStatus = 'manual';

    await visualPause(
      page,
      '[EMAIL-CODE] Preencha o código de segurança no navegador. Se necessário, clique em Verificar e depois Resume.'
    );

    if (page.url().includes('/confirmacao')) {
      context.emailCodeStatus = 'validado';
      console.log('[EMAIL-CODE] Fluxo já está na confirmação após ação manual.');
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
   * Eu deixo a integração Gmail API pronta para evoluir com OAuth, sem automatizar a UI do Gmail.
   */
  async obterCodigoPorGmailApi(context: ExecutionContext): Promise<string | null> {
    context.emailCodeStatus = 'gmail-api';
    return this.gmailProvider.obterCodigoMaisRecente();
  }

  /**
   * Eu reservo a estratégia de endpoint interno de QA para quando ele existir oficialmente.
   */
  async obterCodigoPorInternalApi(context: ExecutionContext): Promise<string | null> {
    context.emailCodeStatus = 'internal-api';
    console.warn('[EMAIL-CODE] EMAIL_CODE_MODE=internal-api ainda não possui endpoint configurado.');
    return null;
  }

  /**
   * Eu reservo a estratégia de log para uso somente com autorização formal do ambiente.
   */
  async obterCodigoPorLog(context: ExecutionContext): Promise<string | null> {
    context.emailCodeStatus = 'log';
    console.warn('[EMAIL-CODE] EMAIL_CODE_MODE=log exige leitura autorizada de logs e ainda não está implementado.');
    return null;
  }

  /**
   * Eu preencho o código encontrado e valido que a tela aceitou a autenticação.
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
