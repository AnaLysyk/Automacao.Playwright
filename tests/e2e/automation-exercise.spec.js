import { test, expect } from '@playwright/test';
import { PaginaInicial } from '../../pages/PaginaInicial.js';
import { PaginaCadastroLogin } from '../../pages/PaginaCadastroLogin.js';
import { PaginaProdutos } from '../../pages/PaginaProdutos.js';
import { PaginaCarrinho } from '../../pages/PaginaCarrinho.js';
import { gerarUsuario, gerarProdutoPesquisa } from '../../utils/gerador-dados.js';

test.describe('Automation Exercise - Testes de Interface', () => {
  test('Cadastro de usuario com sucesso', async ({ page }) => {
    const inicio = new PaginaInicial(page);
    const cadastroLogin = new PaginaCadastroLogin(page);
    const usuario = gerarUsuario();

    await inicio.irParaHome();
    await inicio.validarHome();

    await inicio.abrirCadastroLogin();
    await cadastroLogin.verNovoUsuario();

    await cadastroLogin.preencherInicioCadastro(usuario.nome, usuario.email);
    await cadastroLogin.verInfoConta();

    await cadastroLogin.preencherInfoConta(usuario);
    await cadastroLogin.criarConta();
    await cadastroLogin.verUsuarioLogado(usuario.nome);
  });

  test('Login com email e senha corretos', async ({ page, browser }) => {
    const usuario = gerarUsuario();

    await test.step('Criar usuario via interface (pre-condicao)', async () => {
      const contexto = await browser.newContext();
      const paginaPre = await contexto.newPage();
      const inicioPre = new PaginaInicial(paginaPre);
      const cadastroLoginPre = new PaginaCadastroLogin(paginaPre);

      await inicioPre.irParaHome();
      await inicioPre.validarHome();
      await inicioPre.abrirCadastroLogin();
      await cadastroLoginPre.verNovoUsuario();
      await cadastroLoginPre.preencherInicioCadastro(usuario.nome, usuario.email);
      await cadastroLoginPre.verInfoConta();
      await cadastroLoginPre.preencherInfoConta(usuario);
      await cadastroLoginPre.criarConta();
      await cadastroLoginPre.verUsuarioLogado(usuario.nome);
      await cadastroLoginPre.deslogar();
      await contexto.close();
    });

    const inicio = new PaginaInicial(page);
    const cadastroLogin = new PaginaCadastroLogin(page);

    await inicio.irParaHome();
    await inicio.validarHome();
    await inicio.abrirCadastroLogin();
    await cadastroLogin.verTelaLogin();

    await cadastroLogin.logar(usuario.email, usuario.senha);
    await cadastroLogin.verUsuarioLogado(usuario.nome);
  });

  test('Login com email e senha incorretos', async ({ page }) => {
    const inicio = new PaginaInicial(page);
    const cadastroLogin = new PaginaCadastroLogin(page);
    const usuario = gerarUsuario();

    await inicio.irParaHome();
    await inicio.validarHome();
    await inicio.abrirCadastroLogin();
    await cadastroLogin.verTelaLogin();

    await cadastroLogin.logar(`invalido${usuario.email}`, `Errada${usuario.senha}`);
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
  });

  test('Buscar produto', async ({ page }) => {
    const inicio = new PaginaInicial(page);
    const produtos = new PaginaProdutos(page);
    const termoBusca = gerarProdutoPesquisa();

    await inicio.irParaHome();
    await inicio.validarHome();
    await inicio.abrirProdutos();

    await produtos.verPaginaProdutos();
    await produtos.buscarProduto(termoBusca);
    await produtos.verResultadoBusca();
    await produtos.verProdutosRelacionados();
  });

  test('Adicionar produtos ao carrinho', async ({ page }) => {
    const inicio = new PaginaInicial(page);
    const produtos = new PaginaProdutos(page);
    const carrinho = new PaginaCarrinho(page);

    await inicio.irParaHome();
    await inicio.validarHome();
    await inicio.abrirProdutos();
    await produtos.verPaginaProdutos();

    await produtos.adicionarProduto(0);
    await produtos.continuarComprando();
    await produtos.adicionarProduto(1);
    await produtos.verCarrinho();

    await carrinho.verProdutos(2);
    await carrinho.verPrecosEQuantidades();
  });
});
