import { Page } from '@playwright/test';
import { CidadaoSmartAgendamentoAutenticacaoPage } from '../pages/CidadaoSmartAgendamentoAutenticacaoPage';
import { ExecutionContext } from '../types/ExecutionContext';
import { visualPause } from '../helpers/visualPause';

export class EmailCodeAgent {
  async processarCodigo(
    page: Page,
    autenticacaoPage: CidadaoSmartAgendamentoAutenticacaoPage,
    context: ExecutionContext
  ): Promise<void> {
    const codigo = process.env.CIDADAO_SMART_SECURITY_CODE?.trim();

    if (codigo) {
      console.log('[EMAIL-CODE] Codigo lido de CIDADAO_SMART_SECURITY_CODE.');
      context.emailCodeStatus = 'env';
      await autenticacaoPage.preencherCodigoSeguranca(codigo);
      await autenticacaoPage.verificarCodigo();
      await autenticacaoPage.validarCodigoValidado();
      context.emailCodeStatus = 'validado';
      return;
    }

    console.warn('[EMAIL-CODE] CIDADAO_SMART_SECURITY_CODE ausente. Aguardando preenchimento manual.');
    context.emailCodeStatus = 'manual';
    await visualPause(
      page,
      '[EMAIL-CODE] Preencha o codigo de seguranca no navegador. Se necessario, clique em Verificar e depois Resume.'
    );

    if (page.url().includes('/confirmacao')) {
      context.emailCodeStatus = 'validado';
      console.log('[EMAIL-CODE] Fluxo ja esta na confirmacao apos acao manual.');
      return;
    }

    try {
      await autenticacaoPage.validarCodigoValidado();
    } catch {
      await autenticacaoPage.verificarCodigo();
      await autenticacaoPage.validarCodigoValidado();
    }

    context.emailCodeStatus = 'validado';
  }
}

