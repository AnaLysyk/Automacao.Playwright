import { expect } from '@playwright/test';

export class PaginaCadastroLogin {
  constructor(page) {
    this.page = page;
    this.tituloNovoUsuario = page.getByRole('heading', { name: 'New User Signup!' });
    this.tituloLogin = page.getByRole('heading', { name: 'Login to your account' });
  }

  async verNovoUsuario() {
    await expect(this.tituloNovoUsuario).toBeVisible();
  }

  async verTelaLogin() {
    await expect(this.tituloLogin).toBeVisible();
  }

  async preencherInicioCadastro(nome, email) {
    await this.page.locator('[data-qa="signup-name"]').fill(nome);
    await this.page.locator('[data-qa="signup-email"]').fill(email);
    await this.page.locator('[data-qa="signup-button"]').click();
  }

  async verInfoConta() {
    await expect(this.page.getByText('ENTER ACCOUNT INFORMATION')).toBeVisible();
  }

  async preencherInfoConta(usuario) {
    await this.page.locator('#id_gender1').check();
    await this.page.locator('[data-qa="password"]').fill(usuario.senha);
    await this.page.locator('[data-qa="days"]').selectOption(usuario.diaNascimento);
    await this.page.locator('[data-qa="months"]').selectOption(usuario.mesNascimento);
    await this.page.locator('[data-qa="years"]').selectOption(usuario.anoNascimento);

    await this.page.locator('#newsletter').check();
    await this.page.locator('#optin').check();

    await this.page.locator('[data-qa="first_name"]').fill(usuario.primeiroNome);
    await this.page.locator('[data-qa="last_name"]').fill(usuario.ultimoNome);
    await this.page.locator('[data-qa="company"]').fill(usuario.empresa);
    await this.page.locator('[data-qa="address"]').fill(usuario.endereco);
    await this.page.locator('[data-qa="address2"]').fill(usuario.endereco2);
    await this.page.locator('[data-qa="country"]').selectOption(usuario.pais);
    await this.page.locator('[data-qa="state"]').fill(usuario.estado);
    await this.page.locator('[data-qa="city"]').fill(usuario.cidade);
    await this.page.locator('[data-qa="zipcode"]').fill(usuario.cep);
    await this.page.locator('[data-qa="mobile_number"]').fill(usuario.celular);
  }

  async criarConta() {
    await this.page.locator('[data-qa="create-account"]').click();
    await expect(this.page.getByText('ACCOUNT CREATED!')).toBeVisible();
    await this.page.locator('[data-qa="continue-button"]').click({ force: true });
  }

  async verUsuarioLogado(nome) {
    await expect(this.page.getByText(`Logged in as ${nome}`)).toBeVisible();
  }

  async logar(email, senha) {
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(senha);
    await this.page.locator('[data-qa="login-button"]').click();
  }

  async deslogar() {
    await this.page.getByRole('link', { name: 'Logout' }).click();
  }
}
