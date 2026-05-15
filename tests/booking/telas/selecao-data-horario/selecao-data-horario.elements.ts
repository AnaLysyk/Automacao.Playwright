import { Page } from '@playwright/test';

export class SelecaoDataHorarioElements {
  constructor(private readonly page: Page) {}

  tituloDataHora() {
    return this.page.getByText(/data e hora/i).first();
  }

  nomeInput() {
    // TODO: solicitar data-testid para nome do requerente.
    return this.page.getByPlaceholder('Digite...').first();
  }

  dataNascimentoInput() {
    return this.page.getByPlaceholder('DD/MM/AAAA').first();
  }

  emailInput() {
    return this.page.getByPlaceholder(/exemplo@email/i).first();
  }

  cpfInput() {
    return this.page.getByPlaceholder(/000\.000\.000-00/i).first();
  }

  telefoneInput() {
    return this.page.locator('input[type="tel"], input[placeholder*="48"], input[name*="telefone" i]').first();
  }

  selecioneButton(index: number) {
    return this.page.getByText('Selecione', { exact: true }).nth(index);
  }

  diaButton(dia: string) {
    return this.page.getByRole('button', { name: new RegExp(`^${dia}$`) }).first();
  }

  diasDisponiveis() {
    return this.page.getByRole('button').filter({ hasText: /^[0-9]+$/ });
  }

  horarioButton(horario: string) {
    return this.page.getByRole('button', { name: new RegExp(`^${horario}$`) }).first();
  }

  horariosDisponiveis() {
    return this.page.getByRole('button').filter({ hasText: /[0-9]{2}:[0-9]{2}/ });
  }

  confirmarButton() {
    return this.page.getByRole('button', { name: /confirmar/i }).last();
  }

  prosseguirButton() {
    return this.page.getByRole('button', { name: /prosseguir/i }).first();
  }
}
