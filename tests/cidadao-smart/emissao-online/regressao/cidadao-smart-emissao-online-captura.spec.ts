import fs from 'fs';
import path from 'path';
import { test } from '@support/fixtures';
import { CidadaoSmartEmissaoCapturaPage } from '@support/pages/CidadaoSmartEmissaoCapturaPage';

const FOTO_VALIDA = process.env.CIDADAO_SMART_VALID_PHOTO_PATH || 'tests/support/files/valid-photo.jpg';

test.describe('Cidadao Smart - Emissao Online - Captura', () => {
  test('deve enviar nova foto por upload e habilitar prosseguir', async ({ page }) => {
    const capturaPage = new CidadaoSmartEmissaoCapturaPage(page);
    const fotoExiste = fs.existsSync(path.resolve(FOTO_VALIDA));

    test.skip(!fotoExiste, `Arquivo obrigatorio ausente: ${FOTO_VALIDA}`);

    await test.step('Acessar tela de captura', async () => {
      await capturaPage.acessar();
      await capturaPage.validarTelaCaptura();
    });

    await test.step('Enviar nova foto por file chooser', async () => {
      await capturaPage.enviarNovaFoto(FOTO_VALIDA);
    });

    await test.step('Aceitar ajuste da foto', async () => {
      await capturaPage.aceitarAjusteFoto();
    });

    await test.step('Validar foto capturada e botao prosseguir', async () => {
      await capturaPage.validarFotoCapturadaComSucesso();
      await capturaPage.validarProsseguirHabilitado();
    });
  });
});

