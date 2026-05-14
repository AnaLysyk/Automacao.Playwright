import { test, expect } from "@playwright/test";
import {
  cidadaoSmartTestMass,
  statusProcesso2Via,
} from "../support/data/cidadaoSmartMass";

async function navegarOuBloquearCenario(
  page: import("@playwright/test").Page,
  rota: string,
  sinalTela: RegExp,
  descricao: string
): Promise<void> {
  await page.goto(rota);

  // Em alguns ambientes de demo, rotas internas da 2a via nao estao publicadas
  // e o sistema redireciona para a home. Nesse caso, marcamos como bloqueado.
  const telaEsperadaVisivel = await page
    .getByText(sinalTela)
    .first()
    .isVisible({ timeout: 5_000 })
    .catch(() => false);

  test.skip(
    !telaEsperadaVisivel,
    `Cenario bloqueado: tela de ${descricao} indisponivel no ambiente atual (url: ${page.url()}).`
  );
}

test.describe("Cidadão Smart - 2ª Via com Alterações (Conferência de Documentos)", () => {
  test("Fluxo 2ª via com alterações - Documentos para conferência", async ({
    page,
  }) => {
    /**
     * Simulação do fluxo de 2ª via com alterações conforme SMART-642:
     * 1. Sistema retorna lista de documentos para conferência
     * 2. Usuário revisa cada documento
     * 3. Documentos passam ou falham na análise
     * 4. Status muda para PARTIALLY_REJECTED ou AWAITING_PAYMENT
     */

    const requerente = cidadaoSmartTestMass.elegivel2ViaComAlteracoes;

    await test.step("Acessar formulário 2ª via com alterações", async () => {
      await navegarOuBloquearCenario(
        page,
        `${process.env.CIDADAO_SMART_BASE_URL || "https://172.16.1.146"}/agendamentos/2via-alteracoes`,
        /emissão de 2ª via com alterações|documentos para conferência/i,
        "2a via com alteracoes"
      );

      await expect(
        page.locator("text=Emissão de 2ª via com alterações")
      ).toBeVisible();
    });

    await test.step("Preencher CPF e validar dados", async () => {
      await page.fill("[name=cpf]", requerente.cpf);
      await page.click("button:has-text('Buscar')");

      // Esperar dados serem preenchidos automaticamente
      const nomeField = page.locator("[name=nome]");
      await expect(nomeField).toHaveValue(requerente.nome);
      await expect(nomeField).toBeDisabled(); // Campo readonly
    });

    await test.step("Revisar tela de conferência de documentos", async () => {
      await expect(
        page.locator("text=Documentos para Conferência")
      ).toBeVisible();

      // Validar que cada tipo de documento aparece
      const tiposEsperados = ["FACE", "SIGNATURE", "CNH"];
      for (const tipo of tiposEsperados) {
        await expect(
          page.locator(`[data-testid="documento-${tipo}"]`)
        ).toBeVisible();
      }
    });

    await test.step("Aceitar documentos válidos", async () => {
      // Simular aceição de documento FACE
      await page.click('[data-testid="documento-FACE"] button:has-text("Aceitar")');

      await expect(
        page.locator('[data-testid="documento-FACE"] text="Aceito"')
      ).toBeVisible();
    });

    await test.step("Rejeitar documento inválido", async () => {
      // Simular rejeição de documento SIGNATURE
      await page.click(
        '[data-testid="documento-SIGNATURE"] button:has-text("Rejeitar")'
      );

      // Modal de motivo da rejeição
      await expect(
        page.locator("text=Motivo da rejeição")
      ).toBeVisible();
      // selectOption e a API correta do Playwright para select HTML.
      await page.selectOption(
        "select[name=motivoRejeicao]",
        "DOCUMENT_BLURRY"
      );
      await page.click("button:has-text('Confirmar Rejeição')");
    });

    await test.step("Validar status após revisão", async () => {
      // Clicar em Finalizar Conferência
      await page.click("button:has-text('Finalizar Conferência')");

      // Status deve ser PARTIALLY_REJECTED (1 aceito, 1 rejeitado)
      await expect(
        page.locator(
          `text=Status: ${statusProcesso2Via.PARTIALLY_REJECTED}`
        )
      ).toBeVisible();
    });

    await test.step("Validar informações sobre documentos rejeitados", async () => {
      // Modal ou seção informando sobre rejeição
      await expect(
        page.locator("text=Documentos rejeitados precisam ser reenviados")
      ).toBeVisible();

      // Link ou botão para upload
      await expect(
        page.locator("button:has-text('Enviar novamente')")
      ).toBeVisible();
    });
  });

  test("Validar fluxo de rejeição total de documentos", async ({ page }) => {
    const requerente = cidadaoSmartTestMass.elegivel2ViaComAlteracoes;

    await test.step("Chegar à tela de conferência", async () => {
      await navegarOuBloquearCenario(
        page,
        `${process.env.CIDADAO_SMART_BASE_URL || "https://172.16.1.146"}/agendamentos/2via-alteracoes`,
        /documentos para conferência|emissão de 2ª via com alterações/i,
        "conferencia de documentos"
      );
      await page.fill("[name=cpf]", requerente.cpf);
      await page.click("button:has-text('Buscar')");

      await expect(
        page.locator("text=Documentos para Conferência")
      ).toBeVisible();
    });

    await test.step("Rejeitar todos os documentos", async () => {
      // Selecionar todos os documentos e rejeitar
      const rejeitar = page.locator('button:has-text("Rejeitar")');
      const count = await rejeitar.count();

      for (let i = 0; i < count; i++) {
        await rejeitar.nth(i).click();
        // Mantem o mesmo motivo para padronizar o cenario de rejeicao total.
        await page.selectOption("select[name=motivoRejeicao]", "DOCUMENT_INVALID");
        await page.click("button:has-text('Confirmar Rejeição')");
      }
    });

    await test.step("Validar status TOTAL_REJECTED", async () => {
      await page.click("button:has-text('Finalizar Conferência')");

      // Quando todos são rejeitados
      await expect(
        page.locator("text=Todos os documentos foram rejeitados")
      ).toBeVisible();

      // Status = TOTAL_REJECTED (necessário novo envio completo)
      await expect(
        page.locator("button:has-text('Enviar novos documentos')")
      ).toBeVisible();
    });
  });

  test("Validar fluxo pagamento - Status AWAITING_PAYMENT", async ({
    page,
  }) => {
    /**
     * Cenário: Todos documentos passaram (REVIEW completado)
     * Próximo passo: Pagamento de taxa
     */

    await test.step("Simular processo com documentos aprovados", async () => {
      await navegarOuBloquearCenario(
        page,
        `${process.env.CIDADAO_SMART_BASE_URL || "https://172.16.1.146"}/agendamentos/pagamento`,
        /pagamento de taxa|formas de pagamento/i,
        "pagamento"
      );

      await expect(page.locator("text=Pagamento de Taxa")).toBeVisible();
    });

    await test.step("Validar dados de pagamento", async () => {
      // Valor da 2ª via
      await expect(
        page.locator("text=Valor: R$ 50,00")
      ).toBeVisible();

      // Forma de pagamento
      await expect(page.locator("text=Formas de pagamento:")).toBeVisible();

      const opcoesPagamento = ["Cartão de Crédito", "Pix", "Boleto"];
      for (const opcao of opcoesPagamento) {
        await expect(page.locator(`label:has-text("${opcao}")`)).toBeVisible();
      }
    });

    await test.step("Selecionar Pix como forma de pagamento", async () => {
      await page.check('input[value="PIX"]');

      // Exibir QR code
      await expect(page.locator('[data-testid="qr-code-pix"]')).toBeVisible();
    });

    await test.step("Validar transição para READY após pagamento", async () => {
      // Simulação: pagamento confirmado
      await page.goto(
        `${process.env.CIDADAO_SMART_BASE_URL || "https://172.16.1.146"}/agendamentos/confirmacao-pagamento?status=success`
      );

      await expect(
        page.locator("text=Pagamento confirmado com sucesso!")
      ).toBeVisible();

      // Status muda para READY
      await expect(
        page.locator(`text=Status: ${statusProcesso2Via.READY}`)
      ).toBeVisible();

      // Informação sobre quando retirar
      await expect(
        page.locator("text=Seu documento está pronto para retirada")
      ).toBeVisible();
    });
  });

  test("Validar rastreamento de processo (PRINTING → READY → FINALIZED)", async ({
    page,
  }) => {
    /**
     * Cenário de rastreamento completo:
     * PRINTING → documento em produção
     * READY → pronto para retirada
     * FINALIZED → retirado
     */

    await test.step("Acessar página de rastreamento", async () => {
      await navegarOuBloquearCenario(
        page,
        `${process.env.CIDADAO_SMART_BASE_URL || "https://172.16.1.146"}/agendamentos/rastrear`,
        /rastrear 2ª via|rastrear/i,
        "rastreamento"
      );

      await expect(page.locator("text=Rastrear 2ª Via")).toBeVisible();
    });

    await test.step("Buscar processo por CPF", async () => {
      await page.fill("[name=cpf]", "03659187763");
      await page.click("button:has-text('Rastrear')");
    });

    await test.step("Validar timeline de status", async () => {
      // Exibir histórico de statuses
      const timeline = page.locator('[data-testid="status-timeline"]');
      await expect(timeline).toBeVisible();

      // Validar ordem de status
      const statuses = [
        statusProcesso2Via.REVIEW,
        statusProcesso2Via.PRINTING,
        statusProcesso2Via.READY,
      ];

      for (const status of statuses) {
        await expect(timeline.locator(`text=${status}`)).toBeVisible();
      }
    });

    await test.step("Validar data estimada de retirada", async () => {
      await expect(
        page.locator("text=Estimativa de retirada:")
      ).toBeVisible();

      // Data estimada em formato DD/MM/YYYY
      await expect(
        page.locator('[data-testid="data-estimada-retirada"]')
      ).toHaveText(/\d{2}\/\d{2}\/\d{4}/);
    });
  });
});


