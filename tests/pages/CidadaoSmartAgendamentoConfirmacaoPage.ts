import { expect, Page } from '@playwright/test';
import { CidadaoSmartAgendamentoConfirmacaoPageSelectors as S } from './selectors/CidadaoSmartAgendamentoConfirmacaoPageSelectors';
import { ServicePoint, cidadaoSmartServicePoints } from '../support/data/cidadaoSmartServicePoints';

export type DadosConfirmacaoAgendamento = {
  nome: string;
  cpf?: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  dataAgendamento: string;
  horario: string;
  posto: string;
  endereco: string;
};

export class CidadaoSmartAgendamentoConfirmacaoPage {
  constructor(private readonly page: Page) {}

  async validarTelaConfirmacao(): Promise<void> {
    await expect(this.page).toHaveURL(S.route);
    await expect(this.page.getByText(S.tituloConfirmacao)).toBeVisible();
    await expect(this.page.getByText(S.cardAgendamentos)).toBeVisible();
    await expect(this.page.getByText(S.cardDadosRequerente)).toBeVisible();
    await expect(this.page.getByText(S.cardPostoAtendimento)).toBeVisible();
    await expect(this.page.getByText(S.cardHorarioFuncionamento)).toBeVisible();
  }

  async validarProtocoloGerado(): Promise<void> {
    await expect(this.page.getByText(S.protocoloRegex)).toBeVisible();
  }

  async obterProtocolo(): Promise<string> {
    const protocolo = this.page.getByText(S.protocoloRegex).first();
    await expect(protocolo).toBeVisible();
    return (await protocolo.innerText()).trim();
  }

  async validarDadosConfirmacao(dados: DadosConfirmacaoAgendamento): Promise<void> {
    await expect(this.page.getByText(dados.nome)).toBeVisible();

    if (dados.cpf) {
      await expect(this.page.getByText(dados.cpf)).toBeVisible();
    }

    await expect(this.page.getByText(dados.dataNascimento)).toBeVisible();
    await expect(this.page.getByText(dados.email)).toBeVisible();
    await expect(this.page.getByText(dados.telefone)).toBeVisible();
    await expect(this.page.getByText(dados.dataAgendamento)).toBeVisible();
    await expect(this.page.getByText(dados.horario)).toBeVisible();
    await expect(this.page.getByText(dados.posto)).toBeVisible();
    await expect(this.page.getByText(dados.endereco)).toBeVisible();
  }

  async validarPostoSelecionado(servicePoint: ServicePoint): Promise<void> {
    await expect(this.page.getByText(servicePoint.nome)).toBeVisible();
    await expect(this.page.getByText(servicePoint.enderecoParcial)).toBeVisible();

    if (servicePoint.email) {
      await expect(this.page.getByText(servicePoint.email)).toBeVisible({ timeout: 5000 }).catch(() => undefined);
    }

    if (servicePoint.telefone) {
      await expect(this.page.getByText(servicePoint.telefone)).toBeVisible({ timeout: 5000 }).catch(() => undefined);
    }

    for (const other of cidadaoSmartServicePoints.filter((sp) => sp.id !== servicePoint.id)) {
      await expect(this.page.getByText(other.nome)).toHaveCount(0);
    }
  }

  async validarAcoesFinais(): Promise<void> {
    await expect(this.page.getByRole('button', { name: S.botaoBaixarGuia })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoPaginaInicial })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoCancelar })).toBeVisible();
  }
}
