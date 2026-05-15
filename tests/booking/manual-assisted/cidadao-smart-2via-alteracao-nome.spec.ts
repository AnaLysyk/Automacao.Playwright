import { expect, Locator, Page, test } from '@playwright/test';
import { visualPause } from '../../helpers/visualPause';
import { obterUltimoProtocoloGerado, ProtocoloGerado } from '../../support/reports/protocolos';

function baseUrl(): string {
  return (process.env.CIDADAO_SMART_BASE_URL || 'https://172.16.1.146').replace(/\/+$/, '');
}

function ultimoFinalizado(): ProtocoloGerado {
  // Prioriza o protocolo finalizado pelo SMART, mas permite massa finalizada configurada no .env.local.
  const item = obterUltimoProtocoloGerado({ status: 'FINALIZED' });
  const cpf =
    process.env.CIDADAO_SMART_2VIA_FINALIZADA_CPF ||
    process.env.CIDADAO_SMART_2VIA_ALTERACOES_CPF ||
    item?.cpf;
  const dataNascimento =
    process.env.CIDADAO_SMART_2VIA_FINALIZADA_NASCIMENTO ||
    process.env.CIDADAO_SMART_2VIA_ALTERACOES_NASCIMENTO ||
    item?.dataNascimento;

  test.skip(!item && !cpf, 'Execute antes o fluxo Booking + SMART ate registrar protocolo FINALIZED ou configure massa finalizada.');
  test.skip(!cpf, 'CPF finalizado nao encontrado para 2 via com alteracao.');

  return {
    ...(item || {
      fluxo: 'massa-finalizada-env',
      ambiente: process.env.CIDADAO_SMART_BASE_URL || 'nao-configurado',
      postoSelecionado: 'nao-informado',
      protocolo: 'massa-env',
      dataExecucao: new Date().toISOString(),
      status: 'FINALIZED',
    }),
    cpf,
    dataNascimento,
  } as ProtocoloGerado;
}

async function primeiroVisivel(locators: Locator[], erro: string): Promise<Locator> {
  for (const locator of locators) {
    if (await locator.isVisible({ timeout: 2_000 }).catch(() => false)) return locator;
  }

  throw new Error(erro);
}

async function primeiroVisivelOpcional(locators: Locator[]): Promise<Locator | null> {
  for (const locator of locators) {
    if (await locator.isVisible({ timeout: 1_000 }).catch(() => false)) return locator;
  }

  return null;
}

async function preencherNascimentoSeDisponivel(page: Page, nascimento?: string): Promise<void> {
  // Algumas telas pedem apenas CPF; outras exigem nascimento para localizar o registro.
  if (!nascimento) return;

  const campoNascimento = await primeiroVisivelOpcional([
    page.getByLabel(/data de nascimento|nascimento/i).first(),
    page.getByPlaceholder(/dd\/mm\/aaaa|data de nascimento|nascimento/i).first(),
    page.locator('input[name*="nascimento" i], input[id*="nascimento" i], input[placeholder*="dd/mm/aaaa" i]').first(),
  ]);

  if (campoNascimento) {
    await campoNascimento.fill(nascimento);
  }
}

async function preencherCpfEBuscar(page: Page, cpf: string, nascimento?: string): Promise<void> {
  const campoCpf = await primeiroVisivel(
    [
      page.getByLabel(/cpf/i).first(),
      page.getByPlaceholder(/cpf|000\.000\.000-00/i).first(),
      page.locator('input[name*="cpf" i], input[id*="cpf" i]').first(),
      page.locator('input').first(),
    ],
    'Campo CPF nao encontrado na 2 via com alteracao.'
  );

  await campoCpf.fill(cpf);
  await preencherNascimentoSeDisponivel(page, nascimento);

  const botaoBuscar = await primeiroVisivel(
    [
      page.getByRole('button', { name: /buscar|consultar|prosseguir/i }).first(),
      page.locator('button[type="submit"]').first(),
    ],
    'Botao de busca/prosseguir nao encontrado na 2 via com alteracao.'
  );

  await botaoBuscar.click();
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function alterarNome(page: Page, novoNome: string): Promise<void> {
  const campoNome = await primeiroVisivel(
    [
      page.getByLabel(/nome completo|nome/i).first(),
      page.getByPlaceholder(/nome completo|nome/i).first(),
      page.locator('input[name*="nome" i], input[id*="nome" i]').first(),
    ],
    'Campo de nome nao encontrado para alteracao.'
  );

  await expect(campoNome).toBeEnabled();
  await campoNome.fill(novoNome);
  await expect(campoNome).toHaveValue(novoNome);
}

async function validarTextoOuValor(page: Page, valor: string): Promise<void> {
  const texto = page.getByText(valor).first();
  if (await texto.isVisible({ timeout: 3_000 }).catch(() => false)) return;

  await expect
    .poll(async () => {
      const values = await page.locator('input, textarea').evaluateAll((elements) =>
        elements.map((element: any) => String(element.value || ''))
      );

      return values.includes(valor);
    })
    .toBe(true);
}

test.describe('@2via @alteracao-nome @manual-assisted', () => {
  test('deve preparar solicitacao de 2 via com alteracao no nome', async ({ page }) => {
    test.setTimeout(30 * 60 * 1000);

    // Este teste prepara a alteracao e pausa antes do envio final, salvo liberacao explicita.
    const protocolo = ultimoFinalizado();
    const novoNome =
      process.env.CIDADAO_SMART_2VIA_ALTERACAO_NOME_NOVO ||
      `${protocolo.nome || 'Automacao'} Alterado`;

    await page.goto(`${baseUrl()}/agendamentos/2via-alteracoes`);

    const telaDisponivel = await page
      .getByText(/2a via|2.? via|segunda via|alteracoes|altera..es|cpf/i)
      .first()
      .isVisible({ timeout: 5_000 })
      .catch(() => false);

    test.skip(!telaDisponivel, `Tela de 2 via com alteracoes indisponivel neste ambiente. URL atual: ${page.url()}`);

    await preencherCpfEBuscar(page, protocolo.cpf as string, protocolo.dataNascimento);

    if (protocolo.nome) {
      await validarTextoOuValor(page, protocolo.nome);
    }

    await alterarNome(page, novoNome);

    await visualPause(
      page,
      '[2VIA-ALTERACAO] Nome alterado. Anexe documentos/revise a tela. Clique em Resume quando estiver pronto para a proxima acao.'
    );

    if (process.env.CIDADAO_SMART_ALLOW_FINAL_SUBMIT !== 'true') {
      console.warn('[2VIA-ALTERACAO] CIDADAO_SMART_ALLOW_FINAL_SUBMIT diferente de true. Encerrando antes do envio final.');
      return;
    }

    const botaoFinal = await primeiroVisivel(
      [
        page.getByRole('button', { name: /prosseguir|confirmar|solicitar|finalizar|enviar/i }).first(),
        page.locator('button[type="submit"]').first(),
      ],
      'Botao final de envio nao encontrado na 2 via com alteracao.'
    );

    await botaoFinal.click();
    await page.waitForLoadState('networkidle').catch(() => undefined);

    await visualPause(
      page,
      '[2VIA-ALTERACAO] Solicitacao enviada ou aguardando validacao. Resolva codigo/CAPTCHA se houver e clique em Resume para registrar evidencia.'
    );
  });
});
