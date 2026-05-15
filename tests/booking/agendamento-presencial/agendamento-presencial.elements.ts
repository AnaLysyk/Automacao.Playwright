import { Page } from '@playwright/test';

export class AgendamentoPresencialElements {
  constructor(private readonly page: Page) {}

  body() {
    return this.page.locator('body');
  }

  cidadeRadio() {
    return this.page.getByRole('radio', { name: /cidade/i }).first();
  }

  cidadeInput() {
    // TODO: solicitar data-testid para busca por cidade.
    return this.page.getByPlaceholder(/digite o nome da cidade/i).first();
  }

  cidadeOpcao(cidade: string) {
    // TODO: trocar texto por data-testid quando o frontend expuser.
    return this.page.getByText(new RegExp(cidade, 'i')).first();
  }

  postoOpcao(posto: string) {
    // TODO: trocar texto por data-testid quando o frontend expuser.
    return this.page.getByText(posto).first();
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

  resumoTitle() {
    return this.page.getByText(/^resumo$/i).first();
  }

  codigoInput() {
    // TODO: solicitar data-testid para codigo de seguranca.
    return this.page
      .locator('input[autocomplete="one-time-code"], input[name*="codigo" i], input[id*="codigo" i], input[type="text"], input[type="tel"]')
      .first();
  }

  verificarButton() {
    return this.page.getByRole('button', { name: /verificar/i }).first();
  }

  codigoValidadoMessage() {
    return this.page.getByText(/codigo.*validado|j. pode prosseguir/i).first();
  }

  protocoloText() {
    return this.page.getByText(/0\d{11,}/).first();
  }
}
