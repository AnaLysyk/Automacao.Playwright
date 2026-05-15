import { test } from '@support/fixtures';
import { CidadaoSmartAgendamentoAutenticacaoPage } from '@support/pages/CidadaoSmartAgendamentoAutenticacaoPage';
import { CidadaoSmartAgendamentoConfirmacaoPage } from '@support/pages/CidadaoSmartAgendamentoConfirmacaoPage';
import { CidadaoSmartAgendamentoDataHoraPage } from '@support/pages/CidadaoSmartAgendamentoDataHoraPage';
import { CidadaoSmartAgendamentoLocalPage } from '@support/pages/CidadaoSmartAgendamentoLocalPage';
import { CidadaoSmartAgendamentoResumoPage } from '@support/pages/CidadaoSmartAgendamentoResumoPage';
import { cidadaoSmartTestData } from '@support/data/cidadaoSmartTestData';
import { getServicePointForTest } from '@support/data/getServicePointForTest';
import { obterCodigoSegurancaParaAutenticacao } from '@support/email/obterCodigoSeguranca';
import { prosseguirOuBloquearPorCaptcha } from '@support/flows/cidadaoSmartFlows';
import { salvarProtocoloGerado } from '@support/reports/protocolos';

test.describe('Cidadao Smart - Agendamento presencial', () => {
  test('deve confirmar agendamento no posto selecionado com CPF valido', async ({ page }) => {
    const inicioFluxo = new Date();

    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
    const resumoPage = new CidadaoSmartAgendamentoResumoPage(page);
    const autenticacaoPage = new CidadaoSmartAgendamentoAutenticacaoPage(page);
    const confirmacaoPage = new CidadaoSmartAgendamentoConfirmacaoPage(page);

    const selectedServicePoint = getServicePointForTest();
    const dadosPessoa = cidadaoSmartTestData.requerenteDemo;
    const dadosAgendamento = cidadaoSmartTestData.agendamentoDemo;

    const dados = {
      cidade: 'Florianópolis',
      posto: selectedServicePoint.nome,
      endereco: selectedServicePoint.enderecoParcial,
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
    await localPage.validarTelaLocal();
    await localPage.buscarPorCidade(dados.cidade);
    await localPage.selecionarCidade(dados.cidade);
    await localPage.selecionarPosto(selectedServicePoint.nome);

    await localPage.resolverCaptchaManual();
    await prosseguirOuBloquearPorCaptcha(localPage);

    await dataHoraPage.validarTelaDataHora();
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
    await resumoPage.validarPostoSelecionado(selectedServicePoint);
    await resumoPage.prosseguir();

    await autenticacaoPage.validarTelaAutenticacao();

    const codigoSeguranca = await obterCodigoSegurancaParaAutenticacao({ inicioFluxo });

    await autenticacaoPage.preencherCodigoSeguranca(codigoSeguranca);
    await autenticacaoPage.verificarCodigo();
    await autenticacaoPage.validarCodigoValidado();
    await autenticacaoPage.prosseguir();

    await confirmacaoPage.validarTelaConfirmacao();
    await confirmacaoPage.validarProtocoloGerado();
    await confirmacaoPage.validarDadosConfirmacao({
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
    await confirmacaoPage.validarPostoSelecionado(selectedServicePoint);

    const protocolo = await confirmacaoPage.obterProtocolo();
    salvarProtocoloGerado({
      fluxo: 'agendamento-presencial',
      ambiente: process.env.CIDADAO_SMART_BASE_URL || 'nao-configurado',
      postoSelecionado: selectedServicePoint.nome,
      protocolo,
      status: 'CONFIRMED',
      cpf: dados.cpfSemMascara,
      nome: dados.nome,
      dataNascimento: dados.dataNascimento,
      email: dados.email,
      telefone: dados.telefoneSemMascara,
      dataExecucao: new Date().toISOString(),
    });

    await confirmacaoPage.validarAcoesFinais();
  });
});

