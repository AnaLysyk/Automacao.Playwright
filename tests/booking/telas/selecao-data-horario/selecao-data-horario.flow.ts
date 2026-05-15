import { expect, Page } from '@playwright/test';
import { SelecaoDataHorarioElements } from './selecao-data-horario.elements';

export type DadosRequerente = {
  nome: string;
  dataNascimento: string;
  email: string;
  cpf?: string;
  telefone: string;
};

export class SelecaoDataHorarioFlow {
  private readonly elements: SelecaoDataHorarioElements;

  constructor(private readonly page: Page) {
    this.elements = new SelecaoDataHorarioElements(page);
  }

  async acessarDireto(): Promise<void> {
    await this.page.goto('/agendamentos/novo/data-e-hora');
  }

  async estaNaTela(): Promise<boolean> {
    return /\/agendamentos\/novo\/data-e-hora/i.test(this.page.url());
  }

  async validarTela(): Promise<void> {
    await expect(this.page).toHaveURL(/\/agendamentos\/novo\/data-e-hora/);
    await expect(this.elements.tituloDataHora()).toBeVisible();
  }

  async preencherRequerente(dados: DadosRequerente): Promise<void> {
    await this.elements.nomeInput().fill(dados.nome);
    await this.elements.dataNascimentoInput().fill(dados.dataNascimento);
    await this.elements.emailInput().fill(dados.email);
    await this.elements.telefoneInput().fill(dados.telefone);

    if (dados.cpf) {
      await this.elements.cpfInput().fill(dados.cpf);
    }
  }

  async selecionarData(dataAgendamento: string): Promise<string> {
    const [dia] = dataAgendamento.split('/');
    const diaSemZero = String(Number(dia));

    await this.elements.selecioneButton(0).click();

    if (await this.elements.diaButton(diaSemZero).isEnabled().catch(() => false)) {
      await this.elements.diaButton(diaSemZero).click();
      await this.confirmarSeNecessario();
      return dataAgendamento;
    }

    const opcoes = this.elements.diasDisponiveis();
    const total = await opcoes.count();

    for (let index = 0; index < total; index += 1) {
      const opcao = opcoes.nth(index);
      if (await opcao.isEnabled().catch(() => false)) {
        const texto = (await opcao.innerText()).trim();
        await opcao.click();
        await this.confirmarSeNecessario();
        return texto;
      }
    }

    throw new Error('BOOKING_DATA_INDISPONIVEL');
  }

  async selecionarHorario(horario: string): Promise<string> {
    await this.elements.selecioneButton(1).click();

    if (await this.elements.horarioButton(horario).isEnabled().catch(() => false)) {
      await this.elements.horarioButton(horario).click();
      await this.confirmarSeNecessario();
      return horario;
    }

    const opcoes = this.elements.horariosDisponiveis();
    const total = await opcoes.count();

    for (let index = 0; index < total; index += 1) {
      const opcao = opcoes.nth(index);
      if (await opcao.isEnabled().catch(() => false)) {
        const texto = (await opcao.innerText()).trim();
        await opcao.click();
        await this.confirmarSeNecessario();
        return texto;
      }
    }

    throw new Error('BOOKING_HORARIO_INDISPONIVEL');
  }

  async prosseguir(): Promise<void> {
    await expect(this.elements.prosseguirButton()).toBeVisible();
    await expect(this.elements.prosseguirButton()).toBeEnabled();
    await this.elements.prosseguirButton().click();
  }

  private async confirmarSeNecessario(): Promise<void> {
    if (await this.elements.confirmarButton().isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.elements.confirmarButton().click();
    }
  }
}
