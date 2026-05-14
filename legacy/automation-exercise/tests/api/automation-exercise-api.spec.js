import { test, expect } from '@playwright/test';
import { gerarUsuario } from '../../utils/gerador-dados.js';
import { PaginaInicial } from '../../pages/PaginaInicial.js';
import { PaginaCadastroLogin } from '../../pages/PaginaCadastroLogin.js';

test.describe.configure({ mode: 'serial' });

test.describe('Automation Exercise - Testes de API', () => {
  let usuarioApi;

  test.beforeAll(async ({ browser }) => {
    usuarioApi = gerarUsuario();

    const contexto = await browser.newContext();
    const page = await contexto.newPage();
    const inicio = new PaginaInicial(page);
    const cadastroLogin = new PaginaCadastroLogin(page);

    await inicio.irParaHome();
    await inicio.abrirCadastroLogin();
    await cadastroLogin.preencherInicioCadastro(usuarioApi.nome, usuarioApi.email);
    await cadastroLogin.verInfoConta();
    await cadastroLogin.preencherInfoConta(usuarioApi);
    await cadastroLogin.criarConta();
    await cadastroLogin.verUsuarioLogado(usuarioApi.nome);
    await cadastroLogin.deslogar();
    await contexto.close();
  });

  test('Listar todos os produtos', async ({ request }) => {
    const response = await request.get('https://automationexercise.com/api/productsList');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('Buscar produto por nome', async ({ request }) => {
    const response = await request.post('https://automationexercise.com/api/searchProduct', {
      form: { search_product: 'shirt' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('Buscar produto sem informar parametro', async ({ request }) => {
    const response = await request.post('https://automationexercise.com/api/searchProduct', {
      form: {},
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toContain('search_product parameter is missing');
  });

  test('Validar login por API com credenciais validas', async ({ request }) => {
    const response = await request.post('https://automationexercise.com/api/verifyLogin', {
      form: { email: usuarioApi.email, password: usuarioApi.senha },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('User exists!');
  });
});
