import { expect, test } from '../fixtures';
import { CidadaoSmartAgendamentoDataHoraPage } from '../pages/CidadaoSmartAgendamentoDataHoraPage';
import { CidadaoSmartAgendamentoLocalPage } from '../pages/CidadaoSmartAgendamentoLocalPage';
import {
  birthDateExactly16,
  birthDateFuture,
  birthDateOver16,
  birthDateUnder16,
} from '../support/dates/birthDateFactory';
import { cidadaoSmartTestData } from '../support/data/cidadaoSmartTestData';

const dadosPessoa = cidadaoSmartTestData.requerenteDemo;

async function chegarDataHora(localPage: CidadaoSmartAgendamentoLocalPage): Promise<void> {
  await localPage.acessar();
  await localPage.validarTelaLocal();
  await localPage.buscarPorCidade('Florianópolis');
  await localPage.selecionarCidade('Florianópolis');
  await localPage.selecionarPosto('PCI - FLORIANÓPOLIS - Top Tower');
  await localPage.resolverCaptchaManual();
  await localPage.prosseguir();
}

test.describe('Cidadao Smart - Validacoes agendamento presencial', () => {
  test('nome com uma palavra deve exibir Digite nome e sobrenome', async ({ page }) => {
    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);

    await chegarDataHora(localPage);

    await dataHoraPage.preencherNome('Ana');
    await dataHoraPage.preencherDataNascimento('01/01/2009');
    await dataHoraPage.preencherEmail(dadosPessoa.email);
    await dataHoraPage.preencherCpf('');
    await dataHoraPage.preencherTelefone(dadosPessoa.telefoneSemMascara);
    await dataHoraPage.prosseguir();

    await dataHoraPage.validarMensagemNomeSobrenome();
  });

  test('cpf vazio deve ser permitido', async ({ page }) => {
    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);

    await chegarDataHora(localPage);

    await dataHoraPage.preencherNome(dadosPessoa.nome);
    await dataHoraPage.preencherDataNascimento('01/01/2009');
    await dataHoraPage.preencherEmail(dadosPessoa.email);
    await dataHoraPage.preencherCpf('');
    await dataHoraPage.preencherTelefone(dadosPessoa.telefoneSemMascara);
    await dataHoraPage.selecionarData('18/05/2026');
    await dataHoraPage.selecionarHorarioAgendado('08:00');
    await dataHoraPage.prosseguir();

    await expect(page).toHaveURL(/\/agendamentos\/novo\/resumo/);
  });

  test('telefone vazio deve bloquear', async ({ page }) => {
    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);

    await chegarDataHora(localPage);

    await dataHoraPage.preencherNome(dadosPessoa.nome);
    await dataHoraPage.preencherDataNascimento('01/01/2009');
    await dataHoraPage.preencherEmail(dadosPessoa.email);
    await dataHoraPage.preencherCpf(dadosPessoa.cpfSemMascara);
    await dataHoraPage.preencherTelefone('');
    await dataHoraPage.prosseguir();

    await dataHoraPage.validarTelefoneObrigatorio();
  });

  test('data menor de 16 anos deve validar regra', async ({ page }) => {
    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);

    await chegarDataHora(localPage);

    await dataHoraPage.preencherNome(dadosPessoa.nome);
    await dataHoraPage.preencherDataNascimento(birthDateUnder16());
    await dataHoraPage.preencherEmail(dadosPessoa.email);
    await dataHoraPage.preencherCpf(dadosPessoa.cpfSemMascara);
    await dataHoraPage.preencherTelefone(dadosPessoa.telefoneSemMascara);
    await dataHoraPage.prosseguir();

    await dataHoraPage.validarErroMenorIdade();
  });

  test('data exatamente 16 anos deve seguir regra do sistema', async ({ page }) => {
    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);

    await chegarDataHora(localPage);

    await dataHoraPage.preencherNome(dadosPessoa.nome);
    await dataHoraPage.preencherDataNascimento(birthDateExactly16());
    await dataHoraPage.preencherEmail(dadosPessoa.email);
    await dataHoraPage.preencherCpf(dadosPessoa.cpfSemMascara);
    await dataHoraPage.preencherTelefone(dadosPessoa.telefoneSemMascara);
    await dataHoraPage.prosseguir();
  });

  test('data maior de 16 anos deve permitir', async ({ page }) => {
    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);

    await chegarDataHora(localPage);

    await dataHoraPage.preencherNome(dadosPessoa.nome);
    await dataHoraPage.preencherDataNascimento(birthDateOver16());
    await dataHoraPage.preencherEmail(dadosPessoa.email);
    await dataHoraPage.preencherCpf(dadosPessoa.cpfSemMascara);
    await dataHoraPage.preencherTelefone(dadosPessoa.telefoneSemMascara);
    await dataHoraPage.selecionarData('18/05/2026');
    await dataHoraPage.selecionarHorarioAgendado('08:00');
    await dataHoraPage.prosseguir();

    await expect(page).toHaveURL(/\/agendamentos\/novo\/resumo/);
  });

  test('data futura deve ser invalida', async ({ page }) => {
    const localPage = new CidadaoSmartAgendamentoLocalPage(page);
    const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);

    await chegarDataHora(localPage);

    await dataHoraPage.preencherNome(dadosPessoa.nome);
    await dataHoraPage.preencherDataNascimento(birthDateFuture());
    await dataHoraPage.preencherEmail(dadosPessoa.email);
    await dataHoraPage.preencherCpf(dadosPessoa.cpfSemMascara);
    await dataHoraPage.preencherTelefone(dadosPessoa.telefoneSemMascara);
    await dataHoraPage.prosseguir();

    await dataHoraPage.validarErroDataInvalida();
  });
});

