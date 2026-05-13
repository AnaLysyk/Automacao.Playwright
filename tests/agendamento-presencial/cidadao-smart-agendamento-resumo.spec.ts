import { test } from '../fixtures';
import { CidadaoSmartAgendamentoDataHoraPage } from '../pages/CidadaoSmartAgendamentoDataHoraPage';
import { CidadaoSmartAgendamentoLocalPage } from '../pages/CidadaoSmartAgendamentoLocalPage';
import { CidadaoSmartAgendamentoResumoPage } from '../pages/CidadaoSmartAgendamentoResumoPage';

test.describe('Cidadao Smart - Resumo do agendamento', () => {
  test('deve exibir dados completos do resumo para Top Tower', async ({ page }) => {
    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
    const resumoPage = new CidadaoSmartAgendamentoResumoPage(page);

    const dados = {
      cidade: 'Florianópolis',
      posto: 'PCI - FLORIANÓPOLIS - Top Tower',
      endereco: 'Rua Esteves Júnior, 50',
      cpfSemMascara: '03659184829',
      cpfComMascara: '036.591.848-29',
      nome: 'Ana Teste Automacao',
      dataNascimento: '01/01/2009',
      email: 'ana.testing.company@gmail.com',
      telefoneSemMascara: '55555555555',
      telefoneComMascara: '(55) 55555-5555',
      dataAgendamento: '18/05/2026',
      horario: '08:00',
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

