import fs from 'fs';
import path from 'path';
import { expect, Locator, Page } from '@playwright/test';
import { AuthHelper } from '@support/helpers/AuthHelper';
import { visualPause } from '@support/helpers/visualPause';
import {
  obterUltimoProtocoloGerado,
  ProtocoloGerado,
  registrarStatusProtocolo,
} from '@support/reports/protocolos';

type SmartAutofillMap = Record<string, string | boolean>;

// Escapa texto livre para montar regex sem tratar caracteres especiais como comandos.
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Le numero do .env.local com fallback, evitando NaN em timeouts e tentativas.
function readNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export class SmartProcessAgent {
  constructor(private readonly page: Page) {}

  /**
   * Recupera o ultimo protocolo confirmado pelo Booking e inicia a etapa SMART.
   * O protocolo fica em .runtime para nao ser apagado pelo outputDir do Playwright.
   */
  async finalizarUltimoProtocoloGerado(): Promise<ProtocoloGerado> {
    const protocolo =
      obterUltimoProtocoloGerado({ status: 'CONFIRMED' }) ||
      obterUltimoProtocoloGerado({ fluxo: 'booking-agendamento-assistido' }) ||
      obterUltimoProtocoloGerado({ fluxo: 'agendamento-presencial' });

    if (!protocolo) {
      throw new Error(
        'Nenhum protocolo gerado encontrado em .runtime/protocolos-gerados.json. Execute primeiro o agendamento ate a confirmacao.'
      );
    }

    return this.finalizarProtocolo(protocolo);
  }

  async finalizarProtocolo(item: ProtocoloGerado): Promise<ProtocoloGerado> {
    this.exigirSmartWriteHabilitado();

    await AuthHelper.loginSmart(this.page);
    await this.abrirListaDeProcessos();
    await this.buscarProcessoPorProtocolo(item.protocolo);
    await this.abrirDetalheDoProcesso(item.protocolo);
    await this.aplicarPreenchimentoConfigurado();
    await this.enviarBiometriasSeDisponivel(item.protocolo);

    await visualPause(
      this.page,
      `[SMART] Processo ${item.protocolo} localizado. Se as biometrias ja foram enviadas, avise o QA/operador para prosseguir ate FINALIZADO. Clique em Resume quando o status estiver FINALIZED/FINALIZADO.`
    );

    const finalizado = await this.aguardarStatusFinalizado();

    if (!finalizado) {
      return registrarStatusProtocolo(item.protocolo, 'WAITING_QA', {
        ...item,
        fluxo: 'smart-finalizacao',
        ambiente: process.env.SMART_BASE_URL || item.ambiente,
        observacao: 'Processo localizado no SMART; aguardando QA/operador concluir ate FINALIZADO.',
      });
    }

    return registrarStatusProtocolo(item.protocolo, 'FINALIZED', {
      ...item,
      fluxo: 'smart-finalizacao',
      ambiente: process.env.SMART_BASE_URL || item.ambiente,
      observacao: 'Processo finalizado via fluxo SMART assistido.',
    });
  }

  private exigirSmartWriteHabilitado(): void {
    if (process.env.SMART_WRITE_ENABLED !== 'true') {
      throw new Error('SMART_WRITE_ENABLED precisa ser true para executar fluxo write no SMART.');
    }
  }

  private async abrirListaDeProcessos(): Promise<void> {
    // Primeiro tenta a tela atual; depois menus visiveis; por fim rotas conhecidas do SMART.
    const tabelaOuGrid = this.page.locator('table, [role="table"], [role="grid"]').first();
    if (await tabelaOuGrid.isVisible({ timeout: 2_000 }).catch(() => false)) return;

    const listaProcessos = this.page.getByRole('button', { name: /lista de processos civis/i }).first();
    if (await listaProcessos.isVisible({ timeout: 1_500 }).catch(() => false)) {
      await listaProcessos.click();
      await this.page.waitForLoadState('networkidle').catch(() => undefined);
      return;
    }

    const links = [
      this.page.getByRole('link', { name: /processos|processos civis/i }).first(),
      this.page.locator('a[href*="process"]').first(),
      this.page.locator('a[href*="processos"]').first(),
      this.page.getByText(/processos|processos civis/i).first(),
    ];

    for (const link of links) {
      if (await link.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await link.click();
        await this.page.waitForLoadState('networkidle').catch(() => undefined);
        return;
      }
    }

    const smartBaseUrl = process.env.SMART_BASE_URL;
    if (!smartBaseUrl) {
      throw new Error('SMART_BASE_URL nao configurada para abrir lista de processos.');
    }

    await this.abrirPrimeiraRotaDisponivel([
      `${smartBaseUrl.replace(/\/+$/, '')}/smart/processos-civis`,
      `${this.smartOrigin()}/smart/processos-civis`,
      `${smartBaseUrl.replace(/\/+$/, '')}/processos-civis`,
      `${smartBaseUrl.replace(/\/+$/, '')}/processos`,
    ]);
  }

  private async buscarProcessoPorProtocolo(protocolo: string): Promise<void> {
    // Alguns ambientes abrem direto no detalhe. Nesse caso nao ha busca a fazer.
    if (await this.protocoloVisivel(protocolo)) return;

    const campoBusca = await this.primeiroVisivelOpcional([
      this.page.getByPlaceholder(/protocolo|buscar|pesquisar|search/i).first(),
      this.page.getByLabel(/protocolo|buscar|pesquisar|search/i).first(),
      this.page.locator('input[type="search"]').first(),
      this.page.locator('input').first(),
    ]);

    if (!campoBusca) {
      await this.abrirDetalhePorRotaDireta(protocolo);
      return;
    }

    await campoBusca.fill(protocolo);

    const botaoBuscar = await this.primeiroVisivelOpcional([
      this.page.getByRole('button', { name: /buscar|pesquisar|search|filtrar/i }).first(),
      this.page.locator('button[type="submit"]').first(),
    ]);

    if (botaoBuscar) {
      await botaoBuscar.click();
    } else {
      await campoBusca.press('Enter');
    }

    await this.page.waitForLoadState('networkidle').catch(() => undefined);
    await expect(this.page.getByText(protocolo).first()).toBeVisible({ timeout: 30_000 });
  }

  private async abrirDetalheDoProcesso(protocolo: string): Promise<void> {
    if (await this.protocoloVisivel(protocolo)) return;

    const linha = this.page.locator('tr, [role="row"]').filter({ hasText: protocolo }).first();
    if (await linha.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await linha.click();
    } else {
      await this.page.getByText(protocolo).first().click();
    }

    await this.page.waitForLoadState('networkidle').catch(() => undefined);
    await expect(this.page.getByText(protocolo).first()).toBeVisible({ timeout: 30_000 });
  }

  private async abrirDetalhePorRotaDireta(protocolo: string): Promise<void> {
    // No ambiente 146 o ID interno normalmente corresponde aos ultimos digitos do protocolo.
    const id = String(Number(protocolo.slice(-6)));
    if (!id || id === 'NaN') {
      throw new Error(`Nao foi possivel derivar ID SMART do protocolo ${protocolo}.`);
    }

    const smartBaseUrl = process.env.SMART_BASE_URL;
    if (!smartBaseUrl) {
      throw new Error('SMART_BASE_URL nao configurada para abrir detalhe do processo.');
    }

    await this.abrirPrimeiraRotaDisponivel([
      `${smartBaseUrl.replace(/\/+$/, '')}/smart/processos-civis/${id}`,
      `${this.smartOrigin()}/smart/processos-civis/${id}`,
    ], protocolo);
  }

  private async abrirPrimeiraRotaDisponivel(urls: string[], textoEsperado?: string): Promise<void> {
    // Testa rotas alternativas porque SMART React pode estar publicado em /react e servir telas em /smart.
    for (const url of urls) {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => undefined);
      await this.page.waitForLoadState('networkidle').catch(() => undefined);

      const paginaNaoEncontrada = await this.page
        .getByText(/pagina nao encontrada|p.gina n.o encontrada|n.o foi poss.vel localizar/i)
        .first()
        .isVisible({ timeout: 1_500 })
        .catch(() => false);

      if (paginaNaoEncontrada) continue;
      if (!textoEsperado || (await this.protocoloVisivel(textoEsperado))) return;
    }

    throw new Error(`Nenhuma rota SMART disponivel: ${urls.join(', ')}`);
  }

  private smartOrigin(): string {
    const smartBaseUrl = process.env.SMART_BASE_URL || '';
    return new URL(smartBaseUrl).origin;
  }

  private async protocoloVisivel(protocolo: string): Promise<boolean> {
    return this.page
      .getByText(protocolo)
      .first()
      .isVisible({ timeout: 2_000 })
      .catch(() => false);
  }

  private async aplicarPreenchimentoConfigurado(): Promise<void> {
    // Autofill e opcional: campos especificos de SMART podem mudar por perfil/ambiente.
    const mapa = this.lerMapaPreenchimento();
    if (!mapa) {
      console.log('[SMART] SMART_AUTOFILL_JSON_PATH nao configurado. Mantendo preenchimento assistido/manual.');
      return;
    }

    for (const [campo, valor] of Object.entries(mapa)) {
      await this.preencherCampo(campo, valor);
    }
  }

  private lerMapaPreenchimento(): SmartAutofillMap | null {
    const filePath = process.env.SMART_AUTOFILL_JSON_PATH;
    if (!filePath) return null;

    const resolved = path.resolve(filePath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`SMART_AUTOFILL_JSON_PATH nao encontrado: ${resolved}`);
    }

    return JSON.parse(fs.readFileSync(resolved, 'utf-8')) as SmartAutofillMap;
  }

  private async preencherCampo(campo: string, valor: string | boolean): Promise<void> {
    const campoRegex = new RegExp(escapeRegExp(campo), 'i');
    const locators = [
      this.page.getByLabel(campoRegex).first(),
      this.page.getByPlaceholder(campoRegex).first(),
      this.locatorPorNameOuId(campo),
    ];

    const locator = await this.primeiroVisivelOpcional(locators);
    if (!locator) {
      console.warn(`[SMART] Campo nao encontrado para autofill: ${campo}`);
      return;
    }

    const tagName = await locator.evaluate((element) => element.tagName.toLowerCase()).catch(() => '');
    const inputType = await locator.getAttribute('type').catch(() => '');

    if (tagName === 'select') {
      await locator.selectOption(String(valor));
      return;
    }

    if (inputType === 'checkbox' || inputType === 'radio') {
      if (Boolean(valor)) await locator.check();
      return;
    }

    await locator.fill(String(valor));
  }

  private locatorPorNameOuId(campo: string): Locator {
    const safe = campo.replace(/"/g, '\\"');
    return this.page.locator(`[name="${safe}"], [id="${safe}"]`).first();
  }

  private async enviarBiometriasSeDisponivel(protocolo: string): Promise<void> {
    // Se o botao de envio de biometrias nao estiver disponivel, a etapa segue assistida para o QA.
    if (process.env.SMART_SEND_BIOMETRICS_ENABLED === 'false') {
      console.log('[SMART] SMART_SEND_BIOMETRICS_ENABLED=false. Envio de biometrias mantido manual.');
      return;
    }

    const acaoEnviarBiometria = await this.primeiroVisivelOpcional([
      this.page.getByRole('button', { name: /enviar.*biometr|biometr.*enviar/i }).first(),
      this.page.getByRole('button', { name: /submeter.*biometr|encaminhar.*biometr/i }).first(),
      this.page.getByRole('button', { name: /enviar.*captura|concluir.*biometr|finalizar.*biometr/i }).first(),
      this.page.getByRole('link', { name: /enviar.*biometr|biometr.*enviar/i }).first(),
      this.page.getByText(/enviar.*biometr|biometr.*enviar/i).first(),
    ]);

    if (!acaoEnviarBiometria) {
      console.warn(
        `[SMART] Acao automatica de envio de biometrias nao encontrada para o protocolo ${protocolo}. O passo continua assistido.`
      );
      return;
    }

    await acaoEnviarBiometria.click();
    await this.confirmarDialogoSeExistir();
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
    console.log(`[SMART] Acao de envio de biometrias executada para o protocolo ${protocolo}.`);
  }

  private async confirmarDialogoSeExistir(): Promise<void> {
    const botaoConfirmar = await this.primeiroVisivelOpcional([
      this.page.getByRole('button', { name: /confirmar|sim|ok|enviar|continuar/i }).first(),
      this.page.locator('[role="dialog"] button').filter({ hasText: /confirmar|sim|ok|enviar|continuar/i }).first(),
    ]);

    if (botaoConfirmar) {
      await botaoConfirmar.click();
    }
  }

  private async aguardarStatusFinalizado(): Promise<boolean> {
    // Cada Resume representa uma chance para o QA/operador concluir o processo no SMART.
    const maxResumes = readNumber('SMART_FINALIZED_MAX_RESUMES', 5);

    for (let tentativa = 0; tentativa <= maxResumes; tentativa += 1) {
      if (await this.statusFinalizadoVisivel()) return true;

      await visualPause(
        this.page,
        `[SMART] Status FINALIZED/FINALIZADO ainda nao visivel. Finalize no SMART e clique em Resume. Tentativa ${tentativa + 1}/${maxResumes + 1}.`
      );
    }

    return false;
  }

  private async statusFinalizadoVisivel(): Promise<boolean> {
    return this.page
      .getByText(/FINALIZED|FINALIZADO|finalizado/i)
      .first()
      .isVisible({ timeout: 3_000 })
      .catch(() => false);
  }

  private async primeiroVisivel(locators: Locator[]): Promise<Locator> {
    const locator = await this.primeiroVisivelOpcional(locators);
    if (!locator) throw new Error('Nenhum locator visivel encontrado.');
    return locator;
  }

  private async primeiroVisivelOpcional(locators: Locator[]): Promise<Locator | null> {
    for (const locator of locators) {
      if (await locator.isVisible({ timeout: 1_500 }).catch(() => false)) {
        return locator;
      }
    }

    return null;
  }
}
