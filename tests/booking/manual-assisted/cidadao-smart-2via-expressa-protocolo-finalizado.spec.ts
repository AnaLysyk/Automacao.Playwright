import { expect, Page, test } from '@playwright/test';
import { CidadaoSmartEmissaoCpfPage } from '../../pages/CidadaoSmartEmissaoCpfPage';
import { CidadaoSmartEmissaoTipoPage } from '../../pages/CidadaoSmartEmissaoTipoPage';
import { CidadaoSmartEmissaoResumoPage } from '../../pages/CidadaoSmartEmissaoResumoPage';
import { handleCaptcha } from '../../support/captcha/handleCaptcha';
import { obterUltimoProtocoloGerado, ProtocoloGerado, salvarProtocoloGerado } from '../../support/reports/protocolos';
import { bookingAgendamentoData } from '../../data/bookingAgendamentoData';

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

async function capturarProtocoloDaEmissao(page: Page): Promise<string> {
  const texto = await page.locator('body').innerText();
  const protocolo = texto.match(/0\d{11,}/)?.[0];

  if (!protocolo) {
    throw new Error('Protocolo da emissao expressa nao encontrado na tela de sucesso.');
  }

  return protocolo;
}

test.describe('@2via @expressa @encadeado', () => {
  test('deve reaproveitar dados do protocolo finalizado', async ({ page }) => {
    test.setTimeout(30 * 60 * 1000);

    // Valida que a emissao expressa usa o processo finalizado como base.
    const protocolo = ultimoFinalizado();
    const email = protocolo.email || process.env.CIDADAO_SMART_2VIA_EXPRESSA_EMAIL || bookingAgendamentoData.email;
    const telefone = protocolo.telefone || process.env.CIDADAO_SMART_2VIA_EXPRESSA_TELEFONE || bookingAgendamentoData.telefone;
    const cpfPage = new CidadaoSmartEmissaoCpfPage(page);
    const tipoPage = new CidadaoSmartEmissaoTipoPage(page);
    const resumoPage = new CidadaoSmartEmissaoResumoPage(page);

    await cpfPage.acessar();
    if (await cpfPage.estaNaTelaCpf()) {
      await cpfPage.validarTelaCpf();
      await cpfPage.preencherCpf(protocolo.cpf as string);
      await handleCaptcha(page);
      await cpfPage.prosseguirAutenticacaoAtual();
    }

    await cpfPage.preencherContatoSeNecessario(email, telefone);
    await cpfPage.tratarCodigoSeNecessario();
    await cpfPage.prosseguirParaTipoEmissao();

    await tipoPage.validarTelaTipoEmissao();
    await tipoPage.selecionarReimpressao();
    await tipoPage.prosseguir();

    const rotaEsperada = /\/emitir\/(captura|resumo|validacao-documentos|valida-documentos|instrucoes-foto|sucesso)/i;
    await page.waitForURL(rotaEsperada, { timeout: 60_000 }).catch(() => undefined);
    expect(page.url()).toMatch(rotaEsperada);

    if (/\/emitir\/resumo/i.test(page.url())) {
      await resumoPage.validarTelaResumo();
      if (protocolo.cpf) await validarTextoOuValor(page, protocolo.cpf);
      if (protocolo.nome) await validarTextoOuValor(page, protocolo.nome);
      if (
        protocolo.dataNascimento &&
        (await page.getByText(/data de nascimento|nascimento/i).first().isVisible({ timeout: 1_000 }).catch(() => false))
      ) {
        await validarTextoOuValor(page, protocolo.dataNascimento);
      }
      if (protocolo.email) await validarTextoOuValor(page, protocolo.email);
      if (protocolo.telefone) await validarTextoOuValor(page, protocolo.telefone);
      await resumoPage.validarProsseguirDesabilitado();
      await resumoPage.marcarAceite();
      await resumoPage.validarProsseguirHabilitado();
    }

    if (/\/emitir\/sucesso/i.test(page.url())) {
      const protocoloExpressa = await capturarProtocoloDaEmissao(page);
      salvarProtocoloGerado({
        fluxo: 'cidadao-smart-2via-expressa',
        ambiente: process.env.CIDADAO_SMART_BASE_URL || 'nao-configurado',
        postoSelecionado: 'emissao-online',
        protocolo: protocoloExpressa,
        status: 'EXPRESSA_SUBMITTED',
        cpf: protocolo.cpf,
        dataNascimento: protocolo.dataNascimento,
        email,
        telefone,
        dataExecucao: new Date().toISOString(),
      });
      test.info().annotations.push({
        type: 'protocolo-expressa',
        description: protocoloExpressa,
      });
    }

    test.info().annotations.push({
      type: 'protocolo-base',
      description: protocolo.protocolo,
    });
  });
});
