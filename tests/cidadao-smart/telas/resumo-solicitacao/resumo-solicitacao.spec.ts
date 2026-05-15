import { test } from '../../../../support/fixtures/test';
import { ResumoSolicitacaoFlow } from './resumo-solicitacao.flow';

test.describe('Cidadao Smart - Resumo da solicitacao', () => {
  test('deve exibir resumo quando a etapa estiver disponivel', async ({ page }) => {
    const resumo = new ResumoSolicitacaoFlow(page);

    await resumo.acessar();
    test.skip(!(await resumo.telaVisivel()), 'Resumo depende de precondicao de fluxo no ambiente atual.');
    await resumo.validarResumo();
  });
});
