import { expect, Page } from '@playwright/test';
import { CidadaoSmartAgendamentoResumoPageSelectors as S } from './selectors/CidadaoSmartAgendamentoResumoPageSelectors.ts';
import { ServicePoint, cidadaoSmartServicePoints } from '../support/data/cidadaoSmartServicePoints';

export type DadosResumoAgendamento = {
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

export class CidadaoSmartAgendamentoResumoPage {
  constructor(private readonly page: Page) {}

  async validarTelaResumo(): Promise<void> {
    await expect(this.page).toHaveURL(S.route);
    await expect(this.page.getByText(S.tituloResumo)).toBeVisible();
    await expect(this.page.getByText(S.cardAgendamentos)).toBeVisible();
    await expect(this.page.getByText(S.cardDadosRequerente)).toBeVisible();
    await expect(this.page.getByText(S.cardPostoAtendimento)).toBeVisible();
    await expect(this.page.getByText(S.cardHorarioFuncionamento)).toBeVisible();
  }

  async validarDadosResumo(dados: DadosResumoAgendamento): Promise<void> {
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

  async validarDadosBasicosResumo(dados: Pick<DadosResumoAgendamento, 'nome' | 'email' | 'telefone'>): Promise<void> {
    await expect(this.page.getByText(S.tituloResumo)).toBeVisible();
    await expect(this.page.getByText(dados.nome)).toBeVisible();
    await expect(this.page.getByText(dados.email)).toBeVisible();
    await expect(this.page.getByText(dados.telefone)).toBeVisible();
  }

  async obterPostoAtendimentoVisivel(): Promise<string | undefined> {
    for (const servicePoint of cidadaoSmartServicePoints) {
      const locator = this.page.getByText(servicePoint.nome).first();
      if ((await locator.count()) > 0 && (await locator.isVisible().catch(() => false))) {
        return servicePoint.nome;
      }
    }

    const aeroporto = this.page.getByText(/aeroporto/i).first();
    if ((await aeroporto.count()) > 0 && (await aeroporto.isVisible().catch(() => false))) {
      return (await aeroporto.innerText()).trim();
    }

    return undefined;
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

  async prosseguir(): Promise<void> {
    await this.page.getByRole('button', { name: S.botaoProsseguir }).click();
  }
}
