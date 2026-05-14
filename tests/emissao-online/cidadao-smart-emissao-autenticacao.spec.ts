import { expect, test } from '../fixtures';
import { CidadaoSmartEmissaoAutenticacaoPage } from '../pages/CidadaoSmartEmissaoAutenticacaoPage';
import { handleCaptcha } from '../support/captcha/handleCaptcha';

test.describe('Cidadao Smart - Emissao - Autenticacao', () => {
  test('deve validar layout da tela', async ({ page }) => {
    const autenticacaoPage = new CidadaoSmartEmissaoAutenticacaoPage(page);

    await test.step('Acessar autenticacao e validar campos', async () => {
      await autenticacaoPage.acessar();
      const compativel = await autenticacaoPage.telaCompativelComAutenticacao();
      test.skip(!compativel, 'Tela de autenticacao nao exposta neste ambiente/sessao.');
      await autenticacaoPage.validarTelaAutenticacao();
    });
  });

  test('deve validar campos obrigatorios vazios', async ({ page }) => {
    const autenticacaoPage = new CidadaoSmartEmissaoAutenticacaoPage(page);

    await test.step('Acessar autenticacao', async () => {
      await autenticacaoPage.acessar();
      const compativel = await autenticacaoPage.telaCompativelComAutenticacao();
      test.skip(!compativel, 'Tela de autenticacao nao exposta neste ambiente/sessao.');
    });

    await test.step('Validar bloqueio sem preencher dados', async () => {
      await autenticacaoPage.validarProsseguirDesabilitado();
    });
  });

  test('deve preencher dados validos, resolver captcha e avancar', async ({ page }) => {
    const autenticacaoPage = new CidadaoSmartEmissaoAutenticacaoPage(page);

    await test.step('Acessar tela e preencher dados', async () => {
      await autenticacaoPage.acessar();
      const compativel = await autenticacaoPage.telaCompativelComAutenticacao();
      test.skip(!compativel, 'Tela de autenticacao nao exposta neste ambiente/sessao.');
      await autenticacaoPage.preencherNomeCompleto(process.env.CIDADAO_SMART_EMISSAO_TEST_NOME || 'Ana Teste');
      await autenticacaoPage.preencherDataNascimento(process.env.CIDADAO_SMART_TEST_BIRTH_DATE || '01/01/1990');
      await autenticacaoPage.preencherNomeMaeCompleto(process.env.CIDADAO_SMART_EMISSAO_TEST_NOME_MAE || 'Maria Teste');
    });

    await test.step('Resolver CAPTCHA manualmente', async () => {
      await handleCaptcha(page);
    });

    await test.step('Prosseguir para tipo de emissao', async () => {
      await autenticacaoPage.prosseguir();
      await expect(page).toHaveURL(/\/emitir\/tipo-emissao/i);
    });
  });
});

