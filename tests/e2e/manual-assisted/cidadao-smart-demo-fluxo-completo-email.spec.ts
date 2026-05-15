import type { Locator } from '@playwright/test';
import { expect, test } from '@support/fixtures';
import { CidadaoSmartAgendamentoAutenticacaoPage } from '@support/pages/CidadaoSmartAgendamentoAutenticacaoPage';
import { CidadaoSmartAgendamentoConfirmacaoPage } from '@support/pages/CidadaoSmartAgendamentoConfirmacaoPage';
import { CidadaoSmartAgendamentoDataHoraPage } from '@support/pages/CidadaoSmartAgendamentoDataHoraPage';
import { CidadaoSmartAgendamentoLocalPage } from '@support/pages/CidadaoSmartAgendamentoLocalPage';
import { CidadaoSmartAgendamentoResumoPage } from '@support/pages/CidadaoSmartAgendamentoResumoPage';
import { CidadaoSmartAgendamentoDataHoraPageSelectors as DataHoraS } from '@support/pages/selectors/CidadaoSmartAgendamentoDataHoraPageSelectors';
import { cidadaoSmartTestData } from '@support/data/cidadaoSmartTestData';
import { getServicePointForTest } from '@support/data/getServicePointForTest';
import { obterCodigoSegurancaParaAutenticacao } from '@support/email/obterCodigoSeguranca';

async function digitarComoUsuario(campo: Locator, valor: string): Promise<void> {
  await campo.click();
  await campo.fill('');
  await campo.page().keyboard.type(valor, { delay: 95 });
}

async function pausaVisual(ms = 700): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

test.describe('Demo - Fluxo Completo com Email Assistido', () => {
  test.describe.configure({ timeout: 10 * 60 * 1000 });
  
  test('deve executar agendamento com digitacao humana e validacao de codigo', async ({ page }) => {
    const inicioFluxo = new Date();
    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
    const resumoPage = new CidadaoSmartAgendamentoResumoPage(page);
    const autenticacaoPage = new CidadaoSmartAgendamentoAutenticacaoPage(page);
    const confirmacaoPage = new CidadaoSmartAgendamentoConfirmacaoPage(page);

    const servicePoint = getServicePointForTest();
    const dadosPessoa = cidadaoSmartTestData.requerenteDemo;
    const dadosAgendamento = cidadaoSmartTestData.agendamentoDemo;

    await test.step('1. Acessar local, escolher cidade e posto (quando a sessao exigir)', async () => {
      await localPage.acessar();

      const jaEmDataHora = /\/agendamentos\/novo\/data-e-hora/i.test(page.url());
      if (jaEmDataHora) {
        test.info().annotations.push({
          type: 'ambiente',
          description: 'Sessao redirecionou direto para Data e Hora; etapa de local foi pulada.',
        });
        return;
      }

      await localPage.validarTelaLocal();
      await pausaVisual();
      await localPage.buscarPorCidade('Florian�polis');
      await pausaVisual();
      await localPage.selecionarCidade('Florian�polis');
      await pausaVisual();
      await localPage.selecionarPosto(servicePoint.nome);
      await pausaVisual();
    });

    await test.step('2. Resolver CAPTCHA manualmente e prosseguir (quando estiver na tela local)', async () => {
      if (!/\/agendamentos\/novo\/local/i.test(page.url())) {
        return;
      }

      // Regra de seguranca: CAPTCHA real precisa de acao humana.
      await localPage.resolverCaptchaManual();
      await localPage.prosseguir();
    });

    await test.step('3. Preencher dados com digitacao humana (tecla a tecla)', async () => {
      await dataHoraPage.validarTelaDataHora();

   await digitarComoUsuario(page.getByPlaceholder('Digite...'), dadosPessoa.nome);
    await pausaVisual();

    await digitarComoUsuario(page.getByPlaceholder('DD/MM/AAAA'), dadosPessoa.dataNascimento);
    await pausaVisual();

    await digitarComoUsuario(page.getByPlaceholder('Exemplo@email.com.br'), dadosPessoa.email);
    await pausaVisual();

    await digitarComoUsuario(page.getByPlaceholder('000.000.000-00'), dadosPessoa.cpfSemMascara);
    await pausaVisual();

    await digitarComoUsuario(page.locator('input[placeholder*="48"]'), dadosPessoa.telefoneSemMascara);
    await pausaVisual();

    await dataHoraPage.selecionarData(dadosAgendamento.dataAgendamento);
    await pausaVisual();

    await dataHoraPage.selecionarHorarioAgendado(dadosAgendamento.horario);
    await pausaVisual();

    await dataHoraPage.prosseguir();
    });

    await test.step('4. Validar resumo e continuar', async () => {
      await resumoPage.validarTelaResumo();
      await resumoPage.validarPostoSelecionado(servicePoint);
      await pausaVisual();
      await resumoPage.prosseguir();
    });

    await test.step('5. Validar codigo por e-mail (sem UI de Gmail)', async () => {
      await autenticacaoPage.validarTelaAutenticacao();

      const source = (process.env.CIDADAO_SMART_SECURITY_CODE_SOURCE || 'env').toLowerCase();
      let codigoSeguranca = '';

      if (source === 'imap') {
        // Busca automatica por IMAP sem abrir/automatizar interface de email.
        codigoSeguranca = await obterCodigoSegurancaParaAutenticacao({ inicioFluxo });
      } else {
        // Etapa manual assistida: operador abre o email fora do teste, confere o codigo e continua.
        await page.pause();
        codigoSeguranca = process.env.CIDADAO_SMART_SECURITY_CODE || '';
        test.skip(!codigoSeguranca, 'Defina CIDADAO_SMART_SECURITY_CODE para modo manual/env.');
      }

      await digitarComoUsuario(page.getByLabel(/codigo de seguranca|c�digo de seguran�a/i), codigoSeguranca);
      await pausaVisual();
      await autenticacaoPage.verificarCodigo();
      await autenticacaoPage.validarCodigoValidado();
      await autenticacaoPage.prosseguir();
    });

    await test.step('6. Validar confirmacao final', async () => {
      await confirmacaoPage.validarTelaConfirmacao();
      await confirmacaoPage.validarProtocoloGerado();
      await confirmacaoPage.validarPostoSelecionado(servicePoint);
      await confirmacaoPage.validarAcoesFinais();
      await expect(page).toHaveURL(/\/agendamentos\/novo\/confirmacao/);
    });
  });
});

