import { expect } from '@playwright/test';

export class PaginaInicial {
  constructor(page) {
    this.page = page;
    this.linkCadastroLogin = page.getByRole('link', { name: 'Signup / Login' });
    this.linkProdutos = page.getByRole('link', { name: 'Products' });
  }

  async irParaHome() {
    await this.page.goto('http://automationexercise.com');
    await expect(this.page).toHaveURL(/automationexercise\.com/);
  }

  async validarHome() {
    await expect(this.page.getByRole('link', { name: 'Home' })).toBeVisible();
  }

  async abrirCadastroLogin() {
    await this.linkCadastroLogin.click();
  }

  async abrirProdutos() {
    await this.linkProdutos.click();
  }
}
