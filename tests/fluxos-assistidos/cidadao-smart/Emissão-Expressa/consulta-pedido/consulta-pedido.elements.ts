import type { Locator, Page } from '@playwright/test';

export class ConsultaPedidoElements {
  constructor(private readonly page: Page) {}

  instrucaoConsulta(): Locator {
    return this.page
      .getByText(/digite o numero do seu pedido|consultar o andamento/i)
      .first();
  }

  protocoloInput(): Locator {
    return this.page
      .getByLabel(/protocolo/i)
      .or(
        this.page.locator(
          [
            'input[name*="protocolo" i]',
            'input[id*="protocolo" i]',
            'input[aria-label*="protocolo" i]',
            'input[placeholder*="protocolo" i]',
          ].join(', '),
        ),
      )
      .or(this.page.locator('input[type="text"]').nth(0))
      .first();
  }

  dataNascimentoInput(): Locator {
    return this.page
      .getByLabel(/data de nascimento|nascimento/i)
      .or(this.page.getByPlaceholder(/dd\/mm\/aaaa|data/i))
      .or(
        this.page.locator(
          [
            'input[name*="nascimento" i]',
            'input[id*="nascimento" i]',
            'input[aria-label*="nascimento" i]',
            'input[placeholder*="nascimento" i]',
            'input[placeholder*="dd/mm/aaaa" i]',
          ].join(', '),
        ),
      )
      .or(this.page.locator('input[type="text"]').nth(1))
      .first();
  }

  prosseguirButton(): Locator {
    return this.page.getByRole('button', { name: /prosseguir|continuar/i }).first();
  }

  voltarButton(): Locator {
    return this.page.getByRole('button', { name: /voltar/i }).first();
  }

  captchaContainer(): Locator {
    return this.page
      .locator(
        [
          'iframe[src*="recaptcha"]',
          'iframe[src*="api2/anchor"]',
          'iframe[title*="captcha" i]',
          '[class*="captcha" i]',
          '[id*="captcha" i]',
          '.g-recaptcha',
        ].join(', '),
      )
      .first();
  }

  mensagemErro(): Locator {
    return this.page
      .getByText(/obrigatorio|obrigatoria|campo requerido|invalido|invalida|nao encontrado|nao localizado/i)
      .first();
  }

  erroObrigatorioMessage(): Locator {
    return this.page.getByText(/obrigatorio|obrigatoria|campo requerido/i).first();
  }
}
