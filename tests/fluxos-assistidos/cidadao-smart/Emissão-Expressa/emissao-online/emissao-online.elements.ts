import type { Locator, Page } from '@playwright/test';

export class EmissaoOnlineElements {
  constructor(private readonly page: Page) {}

  cpfInput(): Locator {
    return this.page
      .getByLabel(/cpf/i)
      .or(this.page.getByPlaceholder(/cpf/i))
      .or(
        this.page.locator(
          [
            'input[name*="cpf" i]',
            'input[id*="cpf" i]',
            'input[aria-label*="cpf" i]',
            'input[placeholder*="cpf" i]',
          ].join(', '),
        ),
      )
      .or(this.page.locator('input[type="text"]').nth(0))
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
      .getByText(/obrigatorio|obrigatoria|campo requerido|cpf invalido|invalido|invalida|nao encontrado|nao elegivel/i)
      .first();
  }

  enviarFotoButton(): Locator {
    return this.page
      .getByRole('button', { name: /enviar nova foto|enviar foto|selecionar foto/i })
      .first();
  }

  usarCameraButton(): Locator {
    return this.page.getByRole('button', { name: /usar camera|usar c.mera|tirar foto/i }).first();
  }

  aceitarFotoButton(): Locator {
    return this.page.getByRole('button', { name: /aceitar/i }).first();
  }

  refazerFotoButton(): Locator {
    return this.page.getByRole('button', { name: /refazer|nova foto|trocar foto/i }).first();
  }

  fotoCapturadaMessage(): Locator {
    return this.page.getByText(/foto capturada com sucesso|sua nova foto/i).first();
  }

  resumoDadosRequerente(): Locator {
    return this.page.getByText(/dados do requerente/i).first();
  }

  aceiteResumo(): Locator {
    return this.page
      .locator('input[type="checkbox"], [role="checkbox"], label')
      .filter({ hasText: /estou de acordo|desejo prosseguir/i })
      .first();
  }
}
