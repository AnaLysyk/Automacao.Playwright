import { expect } from '@playwright/test';

export class PaginaProdutos {
  constructor(page) {
    this.page = page;
    this.cardProduto = page.locator('.features_items .product-image-wrapper');
  }

  async verPaginaProdutos() {
    await expect(this.page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    await expect(this.page).toHaveURL(/.*products/);
  }

  async buscarProduto(nomeProduto) {
    await this.page.locator('#search_product').fill(nomeProduto);
    await this.page.locator('#submit_search').click();
  }

  async verResultadoBusca() {
    await expect(this.page.getByText('SEARCHED PRODUCTS')).toBeVisible();
    const quantidade = await this.cardProduto.count();
    expect(quantidade).toBeGreaterThan(0);
  }

  async verProdutosRelacionados() {
    const quantidade = await this.cardProduto.count();
    expect(quantidade).toBeGreaterThan(0);
  }

  async adicionarProduto(indice) {
    const produto = this.cardProduto.nth(indice);
    await produto.scrollIntoViewIfNeeded();
    await produto.hover();
    const botaoSobreposicao = produto.locator('.product-overlay').getByRole('link', { name: 'Add to cart' });
    const botaoInline = produto.getByRole('link', { name: 'Add to cart' }).first();

    try {
      await botaoSobreposicao.waitFor({ state: 'visible', timeout: 5_000 });
      await botaoSobreposicao.click({ timeout: 15_000, force: true });
      return;
    } catch (error) {
      // tenta botao inline
    }

    try {
      await botaoInline.click({ timeout: 15_000, force: true });
      return;
    } catch (error) {
      // abre detalhe como ultimo recurso
      await produto.getByRole('link', { name: 'View Product' }).click();
      await this.page.getByRole('button', { name: 'Add to cart' }).click({ timeout: 15_000 });
      const botaoContinuar = this.page.locator('text=Continue Shopping').first();
      await botaoContinuar.waitFor({ state: 'attached', timeout: 15_000 });
      const elemento = await botaoContinuar.elementHandle();
      if (elemento) {
        await this.page.evaluate((el) => el.click(), elemento);
      }
      await this.page.goBack();
    }
  }

  async continuarComprando() {
    const botaoContinuar = this.page.locator('text=Continue Shopping').first();
    await botaoContinuar.waitFor({ state: 'attached', timeout: 15_000 });
    const elemento = await botaoContinuar.elementHandle();
    if (elemento) {
      await this.page.evaluate((el) => el.click(), elemento);
    }
  }

  async verCarrinho() {
    const botaoVerCarrinhoModal = this.page.getByRole('link', { name: 'View Cart' }).first();
    try {
      await botaoVerCarrinhoModal.waitFor({ state: 'attached', timeout: 5_000 });
      const elemento = await botaoVerCarrinhoModal.elementHandle();
      if (elemento) {
        await this.page.evaluate((el) => el.click(), elemento);
        return;
      }
    } catch (error) {
      // se modal não abrir, tenta menu Cart
    }
    await this.page.getByRole('link', { name: 'Cart' }).click({ timeout: 15_000 });
  }
}
