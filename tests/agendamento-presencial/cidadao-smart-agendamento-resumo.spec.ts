import { test } from '../fixtures';
import { CidadaoSmartAgendamentoDataHoraPage } from '../pages/CidadaoSmartAgendamentoDataHoraPage';
import { CidadaoSmartAgendamentoLocalPage } from '../pages/CidadaoSmartAgendamentoLocalPage';
import { CidadaoSmartAgendamentoResumoPage } from '../pages/CidadaoSmartAgendamentoResumoPage';
import { cidadaoSmartTestData } from '../support/data/cidadaoSmartTestData';

test.describe('Cidadao Smart - Resumo do agendamento', () => {
  test('deve exibir dados completos do resumo para Top Tower', async ({ page }) => {
    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
    const resumoPage = new CidadaoSmartAgendamentoResumoPage(page);

    const dadosPessoa = cidadaoSmartTestData.requerenteDemo;
    const dadosAgendamento = cidadaoSmartTestData.agendamentoDemo;
    const dados = {
      cidade: 'Florianópolis',
      posto: 'PCI - FLORIANÓPOLIS - Top Tower',
      endereco: 'Rua Esteves Júnior, 50',
      cpfSemMascara: dadosPessoa.cpfSemMascara,
      cpfComMascara: dadosPessoa.cpfComMascara,
      nome: dadosPessoa.nome,
      dataNascimento: dadosPessoa.dataNascimento,
      email: dadosPessoa.email,
      telefoneSemMascara: dadosPessoa.telefoneSemMascara,
      telefoneComMascara: dadosPessoa.telefoneComMascara,
      dataAgendamento: dadosAgendamento.dataAgendamento,
      horario: dadosAgendamento.horario,
    };

    await localPage.acessar();
    await localPage.buscarPorCidade(dados.cidade);
    await localPage.selecionarCidade(dados.cidade);
    await localPage.selecionarPosto(dados.posto);
    await localPage.resolverCaptchaManual();
    await localPage.prosseguir();

    await dataHoraPage.preencherNome(dados.nome);
    await dataHoraPage.preencherDataNascimento(dados.dataNascimento);
    await dataHoraPage.preencherEmail(dados.email);
    await dataHoraPage.preencherCpf(dados.cpfSemMascara);
    await dataHoraPage.preencherTelefone(dados.telefoneSemMascara);
    await dataHoraPage.selecionarData(dados.dataAgendamento);
    await dataHoraPage.selecionarHorarioAgendado(dados.horario);
    await dataHoraPage.prosseguir();

    await resumoPage.validarTelaResumo();
    await resumoPage.validarDadosResumo({
      nome: dados.nome,
      cpf: dados.cpfComMascara,
      dataNascimento: dados.dataNascimento,
      email: dados.email,
      telefone: dados.telefoneComMascara,
      dataAgendamento: dados.dataAgendamento,
      horario: dados.horario,
      posto: dados.posto,
      endereco: dados.endereco,
    });
  });
});

