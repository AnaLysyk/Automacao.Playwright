import { test } from '../fixtures';
import { CidadaoSmartAgendamentoAutenticacaoPage } from '../pages/CidadaoSmartAgendamentoAutenticacaoPage';
import { CidadaoSmartAgendamentoDataHoraPage } from '../pages/CidadaoSmartAgendamentoDataHoraPage';
import { CidadaoSmartAgendamentoLocalPage } from '../pages/CidadaoSmartAgendamentoLocalPage';
import { CidadaoSmartAgendamentoResumoPage } from '../pages/CidadaoSmartAgendamentoResumoPage';

test.describe('Cidadao Smart - Autenticacao', () => {
  test('deve validar codigo de seguranca e seguir para confirmacao', async ({ page }) => {
    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
    const resumoPage = new CidadaoSmartAgendamentoResumoPage(page);
    const autenticacaoPage = new CidadaoSmartAgendamentoAutenticacaoPage(page);

    const codigoSeguranca = process.env.CIDADAO_SMART_SECURITY_CODE;
    test.skip(!codigoSeguranca, 'Defina CIDADAO_SMART_SECURITY_CODE para executar autenticacao.');

    await localPage.acessar();
    await localPage.buscarPorCidade('Florianópolis');
    await localPage.selecionarCidade('Florianópolis');
    await localPage.selecionarPosto('PCI - FLORIANÓPOLIS - Top Tower');
    await localPage.resolverCaptchaManual();
    await localPage.prosseguir();

    await dataHoraPage.preencherNome('Ana Teste Automacao');
    await dataHoraPage.preencherDataNascimento('01/01/2009');
    await dataHoraPage.preencherEmail('ana.testing.company@gmail.com');
    await dataHoraPage.preencherCpf('03659184829');
    await dataHoraPage.preencherTelefone('55555555555');
    await dataHoraPage.selecionarData('18/05/2026');
    await dataHoraPage.selecionarHorarioAgendado('08:00');
    await dataHoraPage.prosseguir();

    await resumoPage.prosseguir();
    await autenticacaoPage.validarTelaAutenticacao();
    await autenticacaoPage.preencherCodigoSeguranca(codigoSeguranca!);
    await autenticacaoPage.verificarCodigo();
    await autenticacaoPage.validarCodigoValidado();
    await autenticacaoPage.prosseguir();
  });
});

