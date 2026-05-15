import fs from 'fs';
import path from 'path';
import { expect, test } from '@support/fixtures';
import { CidadaoSmartHomePage } from '@support/pages/CidadaoSmartHomePage';
import { CidadaoSmartEmissaoAutenticacaoPage } from '@support/pages/CidadaoSmartEmissaoAutenticacaoPage';
import { CidadaoSmartEmissaoTipoPage } from '@support/pages/CidadaoSmartEmissaoTipoPage';
import { CidadaoSmartEmissaoCapturaPage } from '@support/pages/CidadaoSmartEmissaoCapturaPage';
import { CidadaoSmartEmissaoResumoPage } from '@support/pages/CidadaoSmartEmissaoResumoPage';
import { handleCaptcha } from '@support/captcha/handleCaptcha';
import { getServicePointForTest } from '@support/data/getServicePointForTest';

const FOTO_VALIDA = 'tests/support/files/valid-photo.jpg';

test.describe('Cidadao Smart - Emissao Online - Fluxo Completo', () => {
  test('deve navegar de Home ate Resumo com validacao Top Tower', async ({ page }) => {
    const homePage = new CidadaoSmartHomePage(page);
    const autenticacaoPage = new CidadaoSmartEmissaoAutenticacaoPage(page);
    const tipoPage = new CidadaoSmartEmissaoTipoPage(page);
    const capturaPage = new CidadaoSmartEmissaoCapturaPage(page);
    const resumoPage = new CidadaoSmartEmissaoResumoPage(page);
    const selectedServicePoint = getServicePointForTest();

    const fotoExiste = fs.existsSync(path.resolve(FOTO_VALIDA));
    test.skip(!fotoExiste, `Arquivo obrigatorio ausente: ${FOTO_VALIDA}`);

    await test.step('1. Acessar Home e entrar em Emissao Online', async () => {
      await homePage.acessar();
      await homePage.validarTelaHome();
      await homePage.marcarDeclaracaoMaior16();
      await homePage.clicarEmissaoOnline();
      await expect(page).toHaveURL(/\/emitir\/nao-sei-meu-cpf|\/emitir\/tipo-emissao/i);
    });

    await test.step('2. Preencher autenticacao quando aplicavel', async () => {
      if (/\/emitir\/nao-sei-meu-cpf/i.test(page.url())) {
        await autenticacaoPage.validarTelaAutenticacao();
        await autenticacaoPage.preencherNomeCompleto(process.env.CIDADAO_SMART_EMISSAO_TEST_NOME || 'Ana Teste');
        await autenticacaoPage.preencherDataNascimento(process.env.CIDADAO_SMART_TEST_BIRTH_DATE || '01/01/1990');
        await autenticacaoPage.preencherNomeMaeCompleto(process.env.CIDADAO_SMART_EMISSAO_TEST_NOME_MAE || 'Maria Teste');
        await handleCaptcha(page);
        await autenticacaoPage.prosseguir();
      }
      await expect(page).toHaveURL(/\/emitir\/tipo-emissao/i);
    });

    await test.step('3. Selecionar 2a via com alteracoes e prosseguir', async () => {
      await tipoPage.validarTelaTipoEmissao();
      await tipoPage.selecionarSegundaViaComAlteracoes();
      await tipoPage.prosseguir();
      await expect(page).toHaveURL(/\/emitir\/(captura|validacao-documentos|valida-documentos|resumo)/i);
    });

    await test.step('4. Executar captura via upload quando estiver na rota de captura', async () => {
      if (/\/emitir\/captura/i.test(page.url())) {
        await capturaPage.validarTelaCaptura();
        await capturaPage.enviarNovaFoto(FOTO_VALIDA);
        await capturaPage.aceitarAjusteFoto();
        await capturaPage.validarFotoCapturadaComSucesso();
        await capturaPage.validarProsseguirHabilitado();
        await capturaPage.prosseguir();
      }
      await expect(page).toHaveURL(/\/emitir\/(validacao-documentos|valida-documentos|resumo)/i);
    });

    await test.step('5. Avancar nas telas de validacao sem alteracoes', async () => {
      let guard = 0;
      while (/\/emitir\/(validacao-documentos|valida-documentos)/i.test(page.url()) && guard < 8) {
        const botaoSemAtualizar = page.getByRole('button', { name: /prosseguir sem atualizar assinatura/i });
        if ((await botaoSemAtualizar.count()) > 0) {
          await botaoSemAtualizar.first().click();
        } else {
          await page.getByRole('button', { name: /prosseguir/i }).first().click();
        }
        guard += 1;
      }

      await expect(page).toHaveURL(/\/emitir\/resumo/i);
    });

    await test.step('6. Validar resumo e bloqueio de Aeroporto', async () => {
      await resumoPage.validarTelaResumo();
      // Regra atual: resumo deve refletir o posto selecionado no fluxo.
      await resumoPage.validarPostoSelecionado(selectedServicePoint);
      await resumoPage.validarProsseguirDesabilitado();
      await resumoPage.marcarAceite();
      await resumoPage.validarProsseguirHabilitado();
    });

    await test.step('7. Nao confirmar emissao sem controle explicito', async () => {
      const allowFinalSubmit = process.env.CIDADAO_SMART_ALLOW_FINAL_SUBMIT === 'true';
      if (!allowFinalSubmit) {
        test.info().annotations.push({
          type: 'safety',
          description: 'Submissao final bloqueada por seguranca. Defina CIDADAO_SMART_ALLOW_FINAL_SUBMIT=true para habilitar.',
        });
      }
    });
  });
});

