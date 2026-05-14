import { test } from '../fixtures';
import { CidadaoSmartAgendamentoAutenticacaoPage } from '../pages/CidadaoSmartAgendamentoAutenticacaoPage';
import { CidadaoSmartAgendamentoDataHoraPage } from '../pages/CidadaoSmartAgendamentoDataHoraPage';
import { CidadaoSmartAgendamentoLocalPage } from '../pages/CidadaoSmartAgendamentoLocalPage';
import { CidadaoSmartAgendamentoResumoPage } from '../pages/CidadaoSmartAgendamentoResumoPage';
import { cidadaoSmartTestData } from '../support/data/cidadaoSmartTestData';

test.describe('Cidadao Smart - Autenticacao', () => {
  test('deve validar codigo de seguranca e seguir para confirmacao', async ({ page }) => {
    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
    const resumoPage = new CidadaoSmartAgendamentoResumoPage(page);
    const autenticacaoPage = new CidadaoSmartAgendamentoAutenticacaoPage(page);

    const codigoSeguranca = process.env.CIDADAO_SMART_SECURITY_CODE;
    const dadosPessoa = cidadaoSmartTestData.requerenteDemo;
    const dadosAgendamento = cidadaoSmartTestData.agendamentoDemo;
    test.skip(!codigoSeguranca, 'Defina CIDADAO_SMART_SECURITY_CODE para executar autenticacao.');

    await localPage.acessar();
    await localPage.buscarPorCidade('Florianópolis');
    await localPage.selecionarCidade('Florianópolis');
    await localPage.selecionarPosto('PCI - FLORIANÓPOLIS - Top Tower');
    await localPage.resolverCaptchaManual();
    await localPage.prosseguir();

    await dataHoraPage.preencherNome(dadosPessoa.nome);
    await dataHoraPage.preencherDataNascimento(dadosPessoa.dataNascimento);
    await dataHoraPage.preencherEmail(dadosPessoa.email);
    await dataHoraPage.preencherCpf(dadosPessoa.cpfSemMascara);
    await dataHoraPage.preencherTelefone(dadosPessoa.telefoneSemMascara);
    await dataHoraPage.selecionarData(dadosAgendamento.dataAgendamento);
    await dataHoraPage.selecionarHorarioAgendado(dadosAgendamento.horario);
    await dataHoraPage.prosseguir();

    await resumoPage.prosseguir();
    await autenticacaoPage.validarTelaAutenticacao();
    await autenticacaoPage.preencherCodigoSeguranca(codigoSeguranca!);
    await autenticacaoPage.verificarCodigo();
    await autenticacaoPage.validarCodigoValidado();
    await autenticacaoPage.prosseguir();
  });
});

