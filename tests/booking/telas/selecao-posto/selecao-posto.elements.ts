import { Page } from '@playwright/test';

export class SelecaoPostoElements {
  constructor(private readonly page: Page) {}

  instrucaoLocalizacao() {
    return this.page.getByText(/informe seu cep ou busque por cidade/i).first();
  }

  cidadeRadio() {
    return this.page.getByRole('radio', { name: /cidade/i }).first();
  }

  cidadeInput() {
    // TODO: solicitar data-testid para busca de cidade.
    return this.page.getByPlaceholder(/digite o nome da cidade/i).first();
  }

  cidadeOpcao(cidade: string) {
    // TODO: substituir texto por data-testid quando o frontend expuser.
    return this.page.getByText(new RegExp(cidade, 'i')).first();
  }

  postoOpcao(nomePosto: string) {
    // TODO: substituir texto por data-testid quando o frontend expuser.
    return this.page.getByText(nomePosto).first();
  }

  prosseguirButton() {
    return this.page.getByRole('button', { name: /prosseguir/i }).first();
  }

  loginMarker() {
    return this.page.getByRole('button', { name: /acessar|entrar|login/i }).first();
  }
}
