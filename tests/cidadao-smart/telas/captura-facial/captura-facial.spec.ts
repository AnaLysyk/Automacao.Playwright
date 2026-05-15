import { test } from '../../../../support/fixtures/test';
import { arquivoExiste } from '../../../../support/utils/arquivos';
import { capturaFacialData } from './captura-facial.data';
import { CapturaFacialFlow } from './captura-facial.flow';

test.describe('Cidadao Smart - Captura facial', () => {
  test('deve enviar nova foto valida por upload', async ({ page }) => {
    test.skip(!arquivoExiste(capturaFacialData.fotoValida), 'Configure CIDADAO_SMART_VALID_PHOTO_PATH para executar captura.');

    const captura = new CapturaFacialFlow(page);

    await captura.acessar();
    await captura.validarTela();
    await captura.enviarImagem(capturaFacialData.fotoValida);
    await captura.aceitarAjuste();
    await captura.validarImagemAceita();
  });
});
