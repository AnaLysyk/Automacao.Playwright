import { expect, Page, TestInfo, test } from '@playwright/test';
import { CidadaoSmartEmissaoCpfPage } from '@support/pages/CidadaoSmartEmissaoCpfPage';
import { CidadaoSmartEmissaoTipoPage } from '@support/pages/CidadaoSmartEmissaoTipoPage';
import { CidadaoSmartEmissaoResumoPage } from '@support/pages/CidadaoSmartEmissaoResumoPage';
import { handleCaptcha } from '@support/captcha/handleCaptcha';
import {
  obterUltimoProtocoloGerado,
  ProtocoloGerado,
  salvarProtocoloGerado,
} from '@support/reports/protocolos';

function ultimoFinalizado(): ProtocoloGerado {
  const item = obterUltimoProtocoloGerado({ status: 'FINALIZED' });

  const cpf =
    process.env.CIDADAO_SMART_2VIA_FINALIZADA_CPF ||
    process.env.CIDADAO_SMART_2VIA_EXPRESSA_CPF ||
    item?.cpf;

  const dataNascimento =
    process.env.CIDADAO_SMART_2VIA_FINALIZADA_NASCIMENTO ||
    process.env.CIDADAO_SMART_2VIA_EXPRESSA_NASCIMENTO ||
    item?.dataNascimento;

  test.skip(
    !item && !cpf,
    'Execute antes o fluxo Booking + SMART até registrar protocolo FINALIZED ou configure massa finalizada.'
  );

  test.skip(!cpf, 'CPF finalizado não encontrado para 2ª via.');

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

function garantirPaginaAberta(page: Page, etapa: string): void {
  if (page.isClosed()) {
    throw new Error(
      `[EMISSAO-EXPRESSA] A página foi fechada durante a etapa: ${etapa}. ` +
        'Reexecute o teste e mantenha o navegador aberto até a automação capturar o protocolo e as evidências.'
    );
  }
}

type CapturaProtocoloRuntime = {
  protocolo?: string;
  origem?: string;
};

function criarCapturaProtocoloRuntime(page: Page): CapturaProtocoloRuntime {
  const captura: CapturaProtocoloRuntime = {};
  const regexProtocolo = /0\d{11,}/;

  const registrar = (valor: string, origem: string): void => {
    const protocolo = valor.match(regexProtocolo)?.[0];
    if (protocolo) {
      captura.protocolo = protocolo;
      captura.origem = origem;
    }
  };

  page.on('console', (message) => {
    registrar(message.text(), 'console');
  });

  page.on('response', async (response) => {
    const url = response.url();
    if (!/protocol|process|emissao|emitir|smartcitizen/i.test(url)) {
      return;
    }

    const contentType = response.headers()['content-type'] || '';
    if (!/json|text/i.test(contentType)) {
      return;
    }

    try {
      registrar(await response.text(), `response:${url}`);
    } catch {
      // Algumas respostas nao permitem leitura do body; nesse caso ignoramos.
    }
  });

  return captura;
}

async function anexarPrint(page: Page, testInfo: TestInfo, nome: string): Promise<void> {
  garantirPaginaAberta(page, `anexar print: ${nome}`);

  await testInfo.attach(nome, {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
}

async function anexarPrintOpcional(page: Page, testInfo: TestInfo, nome: string): Promise<void> {
  if (page.isClosed()) {
    console.warn(`[EMISSAO-EXPRESSA] Print ${nome} ignorado porque a pagina ja foi fechada.`);
    return;
  }

  try {
    await testInfo.attach(nome, {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  } catch (error) {
    console.warn(`[EMISSAO-EXPRESSA] Nao foi possivel anexar print ${nome}: ${String(error)}`);
  }
}

async function validarTextoOuValor(page: Page, valor: string): Promise<void> {
  garantirPaginaAberta(page, `validar texto/valor: ${valor}`);

  const texto = page.getByText(valor).first();

  if (await texto.isVisible({ timeout: 3_000 }).catch(() => false)) {
    return;
  }

  await expect
    .poll(async () => {
      garantirPaginaAberta(page, `poll texto/valor: ${valor}`);

      const values = await page.locator('input, textarea').evaluateAll((elements) =>
        elements.map((element: any) => String(element.value || ''))
      );

      return values.includes(valor);
    })
    .toBe(true);
}

async function capturarProtocoloDaEmissao(page: Page): Promise<string> {
  garantirPaginaAberta(page, 'capturar protocolo da emissão expressa');

  await page.waitForLoadState('domcontentloaded').catch(() => undefined);

  const protocoloNaTela = page.getByText(/0\d{11,}/).first();

  if (await protocoloNaTela.isVisible({ timeout: 10_000 }).catch(() => false)) {
    const textoProtocolo = await protocoloNaTela.innerText();
    const protocolo = textoProtocolo.match(/0\d{11,}/)?.[0];

    if (protocolo) {
      return protocolo;
    }
  }

  const texto = await page.locator('body').innerText({ timeout: 30_000 });
  const protocolo = texto.match(/0\d{11,}/)?.[0];

  if (!protocolo) {
    throw new Error('Protocolo da emissão expressa não encontrado na tela de sucesso.');
  }

  return protocolo;
}

function salvarProtocoloExpressa(params: {
  protocoloExpressa: string;
  protocoloBase: ProtocoloGerado;
  email: string;
  telefone: string;
}): void {
  salvarProtocoloGerado({
    fluxo: 'cidadao-smart-2via-expressa',
    ambiente: process.env.CIDADAO_SMART_BASE_URL || 'nao-configurado',
    postoSelecionado: 'emissao-online',
    protocolo: params.protocoloExpressa,
    status: 'EXPRESSA_SUBMITTED',
    cpf: params.protocoloBase.cpf,
    dataNascimento: params.protocoloBase.dataNascimento,
    email: params.email,
    telefone: params.telefone,
    dataExecucao: new Date().toISOString(),
  });
}

test.describe('@2via @expressa @encadeado', () => {
  test('deve reaproveitar dados do protocolo finalizado', async ({ page }, testInfo) => {
    test.setTimeout(30 * 60 * 1000);

    const protocolo = ultimoFinalizado();

    const email =
      process.env.CIDADAO_SMART_2VIA_EXPRESSA_EMAIL ||
      process.env.CIDADAO_SMART_TEST_EMAIL ||
      protocolo.email ||
      'ana.testing.company@gmail.com';

    const telefone =
      process.env.CIDADAO_SMART_2VIA_EXPRESSA_TELEFONE ||
      process.env.CIDADAO_SMART_TEST_TELEFONE ||
      protocolo.telefone ||
      '51999917265';

    const cpfPage = new CidadaoSmartEmissaoCpfPage(page);
    const tipoPage = new CidadaoSmartEmissaoTipoPage(page);
    const resumoPage = new CidadaoSmartEmissaoResumoPage(page);
    const capturaRuntime = criarCapturaProtocoloRuntime(page);

    await test.step('Acessar emissão e autenticar CPF finalizado', async () => {
      garantirPaginaAberta(page, 'acessar emissão e autenticar CPF finalizado');

      await cpfPage.acessar();

      if (await cpfPage.estaNaTelaCpf()) {
        await cpfPage.validarTelaCpf();
        await cpfPage.preencherCpf(protocolo.cpf as string);

        await anexarPrint(page, testInfo, '01-cpf-preenchido');

        await handleCaptcha(page);

        await anexarPrint(page, testInfo, '02-captcha-resolvido');

        await cpfPage.prosseguirAutenticacaoAtual();
      }
    });

    await test.step('Selecionar posto de retirada, se necessário', async () => {
      garantirPaginaAberta(page, 'selecionar posto de retirada');

      await cpfPage.selecionarPostoRetiradaSeNecessario();
      await anexarPrint(page, testInfo, '03-posto-selecionado-ou-nao-exigido');
    });

    await test.step('Preencher contato para receber código', async () => {
      garantirPaginaAberta(page, 'preencher contato para receber código');

      await cpfPage.preencherContatoSeNecessario(email, telefone);
      await anexarPrint(page, testInfo, '04-contato-preenchido');
    });

    await test.step('Tratar código de segurança', async () => {
      garantirPaginaAberta(page, 'tratar código de segurança');

      await cpfPage.tratarCodigoSeNecessario();

      garantirPaginaAberta(
        page,
        'após pausa manual do código de segurança. Não feche o navegador antes de clicar em Resume.'
      );

      await anexarPrint(page, testInfo, '05-codigo-validado');
    });

    await test.step('Avançar para tipo de emissão', async () => {
      garantirPaginaAberta(page, 'avançar para tipo de emissão');

      await cpfPage.prosseguirParaTipoEmissao();
      if (/\/emitir\/sucesso/i.test(page.url())) return;
      await expect(page).toHaveURL(/\/emitir\/tipo-emissao/i);
      await anexarPrint(page, testInfo, '06-tipo-emissao');
    });

    await test.step('Selecionar reimpressão / via expressa', async () => {
      if (/\/emitir\/sucesso/i.test(page.url())) return;
      garantirPaginaAberta(page, 'selecionar reimpressão / via expressa');

      await tipoPage.validarTelaTipoEmissao();
      await tipoPage.selecionarReimpressao();

      await anexarPrint(page, testInfo, '07-reimpressao-selecionada');

      await tipoPage.prosseguir();
    });

    const rotaEsperada =
      /\/emitir\/(captura|resumo|validacao-documentos|valida-documentos|instrucoes-foto|sucesso)/i;

    if (!/\/emitir\/sucesso/i.test(page.url())) {
      await page.waitForURL(rotaEsperada, { timeout: 60_000 }).catch(() => undefined);
    }

    garantirPaginaAberta(page, 'aguardar rota após selecionar reimpressão');

    expect(page.url()).toMatch(rotaEsperada);

    if (/\/emitir\/resumo/i.test(page.url())) {
      await test.step('Validar resumo e prosseguir', async () => {
        garantirPaginaAberta(page, 'validar resumo e prosseguir');

        await resumoPage.validarTelaResumo();

        if (protocolo.cpf) {
          await validarTextoOuValor(page, protocolo.cpf);
        }

        if (protocolo.nome) {
          await validarTextoOuValor(page, protocolo.nome);
        }

        if (
          protocolo.dataNascimento &&
          (await page
            .getByText(/data de nascimento|nascimento/i)
            .first()
            .isVisible({ timeout: 1_000 })
            .catch(() => false))
        ) {
          await validarTextoOuValor(page, protocolo.dataNascimento);
        }

        if (protocolo.email) {
          await validarTextoOuValor(page, protocolo.email);
        }

        if (protocolo.telefone) {
          await validarTextoOuValor(page, protocolo.telefone);
        }

        await anexarPrint(page, testInfo, '08-resumo-dados-reaproveitados');

        await resumoPage.validarProsseguirDesabilitado();
        await resumoPage.marcarAceite();

        await anexarPrint(page, testInfo, '09-resumo-aceite-marcado');

        await resumoPage.validarProsseguirHabilitado();
        await resumoPage.prosseguir();

        await page.waitForURL(/\/emitir\/sucesso/i, { timeout: 60_000 }).catch(() => undefined);
      });
    }

    await test.step('Validar sucesso e capturar protocolo da via expressa', async () => {
      if (page.isClosed() && capturaRuntime.protocolo) {
        salvarProtocoloExpressa({
          protocoloExpressa: capturaRuntime.protocolo,
          protocoloBase: protocolo,
          email,
          telefone,
        });

        test.info().annotations.push({
          type: 'protocolo-expressa',
          description: `${capturaRuntime.protocolo} (${capturaRuntime.origem || 'runtime'})`,
        });

        console.log(`[EMISSAO-EXPRESSA] Protocolo capturado antes do fechamento: ${capturaRuntime.protocolo}`);
        return;
      }

      garantirPaginaAberta(
        page,
        'validar sucesso e capturar protocolo. Mantenha a tela de sucesso aberta antes de clicar em Resume.'
      );

      await page.waitForURL(/\/emitir\/sucesso/i, { timeout: 60_000 }).catch(() => undefined);

      garantirPaginaAberta(page, 'após aguardar tela de sucesso');

      await expect(page).toHaveURL(/\/emitir\/sucesso/i);

      const protocoloExpressa = await capturarProtocoloDaEmissao(page);

      salvarProtocoloExpressa({
        protocoloExpressa,
        protocoloBase: protocolo,
        email,
        telefone,
      });

      test.info().annotations.push({
        type: 'protocolo-base',
        description: protocolo.protocolo,
      });

      test.info().annotations.push({
        type: 'protocolo-expressa',
        description: protocoloExpressa,
      });

      console.log('============================================================');
      console.log(`[EMISSAO-EXPRESSA] PROTOCOLO CAPTURADO: ${protocoloExpressa}`);
      console.log('[EMISSAO-EXPRESSA] Caso aprovado: protocolo capturado.');
      console.log('============================================================');

      console.log(`[EMISSAO-EXPRESSA] Protocolo base: ${protocolo.protocolo}`);
      console.log(`[EMISSAO-EXPRESSA] Protocolo gerado: ${protocoloExpressa}`);
      console.log('[EMISSAO-EXPRESSA] Fluxo aprovado com evidência.');
    });
  });
});
