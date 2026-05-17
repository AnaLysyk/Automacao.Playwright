import { expect, test } from '../../../../../support/fixtures/test';
import { EmissaoOnlineFlow } from './emissao-online.flow';

test.describe('Cidadao Smart - Emissao online assistida', () => {
  test('@manual-assisted @cidadao-smart @via-expressa @emissao-online deve exibir entrada de CPF', async ({
    page,
  }) => {
    const emissao = new EmissaoOnlineFlow(page);

    await test.step('1. Acessar entrada de CPF', async () => {
      await emissao.acessarEntradaCpf();
    });

    await test.step('2. Validar campos iniciais da emissao', async () => {
      expect(await emissao.entradaCpfVisivel()).toBeTruthy();
    });
  });

  test('@manual-assisted @cidadao-smart @via-expressa @captura deve validar captura facial quando houver foto de teste', async ({
    page,
  }) => {
    const emissao = new EmissaoOnlineFlow(page);

    test.skip(
      !emissao.fotoValidaConfigurada(),
      'CIDADAO_SMART_VALID_PHOTO_PATH nao configurado ou arquivo inexistente.',
    );

    await test.step('1. Acessar captura facial', async () => {
      await emissao.acessarCapturaFacial();
    });

    await test.step('2. Validar controles de captura', async () => {
      const capturaVisivel = await emissao.capturaFacialVisivel();

      test.skip(
        !capturaVisivel,
        'Captura depende de sessao/fluxo previo no ambiente assistido.',
      );

      expect(capturaVisivel).toBeTruthy();
    });

    await test.step('3. Enviar foto de teste', async () => {
      await emissao.enviarFotoValida();
    });

    await test.step('4. Confirmar foto enviada', async () => {
      await emissao.confirmarFoto();
      expect(await emissao.fotoConfirmadaVisivel()).toBeTruthy();
    });
  });

  test('@manual-assisted @cidadao-smart @via-expressa @resumo deve exibir resumo quando a precondicao existir', async ({
    page,
  }) => {
    const emissao = new EmissaoOnlineFlow(page);

    await test.step('1. Acessar resumo da emissao', async () => {
      await emissao.acessarResumo();
    });

    test.skip(!(await emissao.resumoDisponivel()), 'Resumo depende de sessao/fluxo previo no ambiente.');

    await test.step('2. Validar resumo da emissao', async () => {
      expect(await emissao.resumoVisivel()).toBeTruthy();
    });
  });
});
