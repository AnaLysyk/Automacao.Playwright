import { expect } from '@playwright/test';

export class PaginaCarrinho {
  constructor(page) {
    this.page = page;
    this.linhasCarrinho = page.locator('.cart_info tbody tr');
  }

  async verProdutos(quantidadeEsperada) {
    await expect(this.linhasCarrinho).toHaveCount(quantidadeEsperada);
  }

  async verPrecosEQuantidades() {
    const linhas = await this.linhasCarrinho.all();
    for (const linha of linhas) {
      await expect(linha.locator('.cart_price')).toBeVisible();
      await expect(linha.locator('.cart_quantity')).toBeVisible();
      await expect(linha.locator('.cart_total')).toBeVisible();
    }
  }
}
