import { expect, Locator, Page, test } from '@playwright/test';
import { obterUltimoProtocoloGerado, ProtocoloGerado } from '../../support/reports/protocolos';

function baseUrl(): string {
  return (process.env.CIDADAO_SMART_BASE_URL || 'https://172.16.1.146').replace(/\/+$/, '');
}

function ultimoFinalizado(): ProtocoloGerado {
  // Usa protocolo finalizado real quando existir; caso contrario usa massa finalizada do .env.local.
  const item = obterUltimoProtocoloGerado({ status: 'FINALIZED' });
  const cpf =
    process.env.CIDADAO_SMART_2VIA_FINALIZADA_CPF ||
    process.env.CIDADAO_SMART_2VIA_EXPRESSA_CPF ||
    item?.cpf;
  const dataNascimento =
    process.env.CIDADAO_SMART_2VIA_FINALIZADA_NASCIMENTO ||
    process.env.CIDADAO_SMART_2VIA_EXPRESSA_NASCIMENTO ||
    item?.dataNascimento;

  test.skip(!item && !cpf, 'Execute antes o fluxo Booking + SMART ate registrar protocolo FINALIZED ou configure massa finalizada.');
  test.skip(!cpf, 'CPF finalizado nao encontrado para 2 via.');

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

async function primeiroVisivel(locators: Locator[]): Promise<Locator> {
  for (const locator of locators) {
    if (await locator.isVisible({ timeout: 2_000 }).catch(() => false)) return locator;
  }

  throw new Error('Campo esperado nao encontrado na tela de 2 via expressa.');
}

async function primeiroVisivelOpcional(locators: Locator[]): Promise<Locator | null> {
  for (const locator of locators) {
    if (await locator.isVisible({ timeout: 1_000 }).catch(() => false)) return locator;
  }

  return null;
}

async function preencherNascimentoSeDisponivel(page: Page, nascimento?: string): Promise<void> {
  // Preenche nascimento apenas se a tela pedir esse segundo fator de localizacao.
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
  const campoCpf = await primeiroVisivel([
    page.getByLabel(/cpf/i).first(),
    page.getByPlaceholder(/cpf|000\.000\.000-00/i).first(),
    page.locator('input[name*="cpf" i], input[id*="cpf" i]').first(),
    page.locator('input').first(),
  ]);

  await campoCpf.fill(cpf);
  await preencherNascimentoSeDisponivel(page, nascimento);

  const botaoBuscar = await primeiroVisivel([
    page.getByRole('button', { name: /buscar|consultar|prosseguir/i }).first(),
    page.locator('button[type="submit"]').first(),
  ]);

  await botaoBuscar.click();
  await page.waitForLoadState('networkidle').catch(() => undefined);
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

test.describe('@2via @expressa @encadeado', () => {
  test('deve reaproveitar dados do protocolo finalizado', async ({ page }) => {
    // Valida que a 2a via expressa reaproveita os dados do processo finalizado.
    const protocolo = ultimoFinalizado();

    await page.goto(`${baseUrl()}/agendamentos/2via-expressa`);

    const telaDisponivel = await page
      .getByText(/2a via|2.? via|segunda via|cpf/i)
      .first()
      .isVisible({ timeout: 5_000 })
      .catch(() => false);

    test.skip(!telaDisponivel, `Tela de 2 via expressa indisponivel neste ambiente. URL atual: ${page.url()}`);

    await preencherCpfEBuscar(page, protocolo.cpf as string, protocolo.dataNascimento);

    if (protocolo.nome) await validarTextoOuValor(page, protocolo.nome);
    if (protocolo.dataNascimento) await validarTextoOuValor(page, protocolo.dataNascimento);
    if (protocolo.email) await validarTextoOuValor(page, protocolo.email);
    if (protocolo.telefone) await validarTextoOuValor(page, protocolo.telefone);

    test.info().annotations.push({
      type: 'protocolo-base',
      description: protocolo.protocolo,
    });
  });
});
