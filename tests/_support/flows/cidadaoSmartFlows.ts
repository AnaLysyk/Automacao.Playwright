import { Page, test } from '@playwright/test';
import { CidadaoSmartAgendamentoDataHoraPage } from '@support/pages/CidadaoSmartAgendamentoDataHoraPage';
import { CidadaoSmartAgendamentoLocalPage } from '@support/pages/CidadaoSmartAgendamentoLocalPage';
import { handleCaptcha } from '@support/captcha/handleCaptcha';

export async function prosseguirOuBloquearPorCaptcha(
  localPage: { prosseguir(): Promise<void> }
): Promise<void> {
  try {
    await localPage.prosseguir();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const captchaBloqueou = /CAPTCHA_BLOQUEOU_PROSSEGUIR/i.test(message);

    test.skip(
      captchaBloqueou,
      'Cenario bloqueado: CAPTCHA real nao liberou o botao Prosseguir. Use fluxo manual-assisted ou bypass oficial de QA.'
    );

    throw error;
  }
}

/**
 * Fluxo reutilizavel para chegar na tela Data e Hora.
 * Mantem as specs menores e evita duplicacao de passos de localizacao.
 */
export async function chegarNaTelaDataHora(
  page: Page,
  cidade: string = 'Florianópolis',
  posto: string = 'PCI - FLORIANÓPOLIS - Top Tower'
) {
  const localPage = new CidadaoSmartAgendamentoLocalPage(page);

  await localPage.acessar();
  await localPage.validarTelaLocal();
  await localPage.buscarPorCidade(cidade);
  await localPage.selecionarCidade(cidade);
  await localPage.selecionarPosto(posto);
  await handleCaptcha(page);
  await prosseguirOuBloquearPorCaptcha(localPage);
}

/**
 * Fluxo reutilizavel para chegar na tela de Resumo.
 * Retorna data e horario selecionados para validacao posterior.
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
  dataAgendamento: string = '18/05/2026',
  horarioAgendamento: string = '08:00'
) {
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
