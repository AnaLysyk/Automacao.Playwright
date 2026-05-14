import { Page } from "@playwright/test";

/**
 * Helper para fluxo reutilizável: chegar na tela Data e Hora.
 * Usado pelos specs de validação para evitar duplicação.
 */
export async function chegarNaTelaDataHora(
  page: Page,
  cidade: string = "Florianópolis",
  posto: string = "PCI - FLORIANÓPOLIS - Top Tower"
) {
  // Importa aqui para evitar dependência circular
  const { CidadaoSmartAgendamentoLocalPage } = await import(
    "../../pages/CidadaoSmartAgendamentoLocalPage.js"
  );
  const { handleCaptcha } = await import("../captcha/handleCaptcha.js");

  const localPage = new CidadaoSmartAgendamentoLocalPage(page);

  await localPage.acessar();
  await localPage.validarTelaLocal();
  await localPage.buscarPorCidade(cidade);
  await localPage.selecionarCidade(cidade);
  await localPage.selecionarPosto(posto);
  await handleCaptcha(page);
  await localPage.prosseguir();
}

/**
 * Helper para fluxo reutilizável: chegar na tela de Resumo.
 * Retorna data e horário selecionados para validação posterior.
 */
export async function chegarNaTelaResumo(
  page: Page,
  requerente: {
    nome: string;
    dataNascimento: string;
    email: string;
    cpf?: string;
    telefone: string;
  },
  dataAgendamento: string = "18/05/2026",
  horarioAgendamento: string = "08:00"
) {
  const { CidadaoSmartAgendamentoDataHoraPage } = await import(
    "../../pages/CidadaoSmartAgendamentoDataHoraPage.js"
  );

  const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);

  await dataHoraPage.validarTelaDataHora();
  await dataHoraPage.preencherNome(requerente.nome);
  await dataHoraPage.preencherDataNascimento(requerente.dataNascimento);
  await dataHoraPage.preencherEmail(requerente.email);

  if (requerente.cpf) {
    await dataHoraPage.preencherCpf(requerente.cpf);
  }

  await dataHoraPage.preencherTelefone(requerente.telefone);
  await dataHoraPage.selecionarData(dataAgendamento);
  await dataHoraPage.selecionarHorarioAgendado(horarioAgendamento);
  await dataHoraPage.prosseguir();

  return { dataAgendamento, horarioAgendamento };
}
