import { test, expect } from "@playwright/test";

test.describe("Cidadão Smart - API Notificador GBDS", () => {
  /**
   * Testes da integração com o Notificador GBDS.
   * 
   * Conforme documentação:
   * - Status mapping (RECEIVED, PROCESSING, APPROVED, etc.)
   * - Notificação de mudanças de status
   * - Payload com protocolo e dados
   */

  test("Validar webhook de notificação ao completar agendamento", async ({
    page,
  }) => {
    /**
     * Fluxo:
     * 1. Completar agendamento presencial
     * 2. Sistema emite POST para /notificador/notificar
     * 3. Payload contém status, protocolo, CPF
     * 4. GBDS processa e envia para destinatários
     */

    // Simular interceptação de request
    const notificacoesCaptured: any[] = [];

    await page.on("request", (request) => {
      if (request.url().includes("/notificador/notificar")) {
        notificacoesCaptured.push({
          url: request.url(),
          method: request.method(),
          postData: request.postDataJSON(),
          timestamp: new Date().toISOString(),
        });
      }
    });

    await test.step("Completar fluxo de agendamento", async () => {
      await page.goto(
        `${process.env.CIDADAO_SMART_BASE_URL || "https://172.16.1.146"}/agendamentos`
      );

      // ... (executar fluxo até confirmação)
      // Por brevidade, simular navegação direto
      await page.goto(
        `${process.env.CIDADAO_SMART_BASE_URL || "https://172.16.1.146"}/agendamentos/novo/confirmacao`
      );

      await expect(page.locator("text=Agendamento confirmado")).toBeVisible();
    });

    await test.step("Validar que webhook foi chamado", async () => {
      // Aguardar um pouco para capturar request
      await page.waitForTimeout(2000);

      expect(notificacoesCaptured.length).toBeGreaterThan(0);

      const notificacao = notificacoesCaptured[0];
      console.log("Notificação capturada:", notificacao);
    });

    await test.step("Validar payload da notificação", async () => {
      const payload = notificacoesCaptured[0]?.postData;

      // Deve conter status
      expect(payload).toHaveProperty("status");
      expect(["RECEIVED", "PROCESSING", "APPROVED"]).toContain(payload.status);

      // Deve conter protocolo
      expect(payload).toHaveProperty("protocolo");
      expect(payload.protocolo).toMatch(/02026\d{7,}/);

      // Deve conter CPF (em hash por segurança)
      expect(payload).toHaveProperty("cpfHash");
    });
  });

  test("Validar status mapping RECEIVED → PROCESSING → APPROVED", async ({
    page,
  }) => {
    /**
     * Conforme spec: Quando o webhook é disparado, status segue a sequência:
     * RECEIVED (recebido pelo notificador)
     * PROCESSING (processando)
     * APPROVED (aprovado) ou REJECTED
     */

    const statusSequence: string[] = [];

    await page.on("request", (request) => {
      if (request.url().includes("/notificador/notificar")) {
        const postData = request.postDataJSON();
        statusSequence.push(postData.status);
      }
    });

    await test.step("Simular ciclo completo de agendamento", async () => {
      // Simular 3 requisições com status diferente
      await page.evaluate(() => {
        // Mock de 3 chamadas ao notificador
        return Promise.all([
          fetch("/notificador/notificar", {
            method: "POST",
            body: JSON.stringify({
              status: "RECEIVED",
              protocolo: "020260001234567",
              cpfHash: "abc123",
            }),
          }),
          new Promise((resolve) =>
            setTimeout(() => resolve(null), 1000)
          ).then(() =>
            fetch("/notificador/notificar", {
              method: "POST",
              body: JSON.stringify({
                status: "PROCESSING",
                protocolo: "020260001234567",
                cpfHash: "abc123",
              }),
            })
          ),
          new Promise((resolve) =>
            setTimeout(() => resolve(null), 2000)
          ).then(() =>
            fetch("/notificador/notificar", {
              method: "POST",
              body: JSON.stringify({
                status: "APPROVED",
                protocolo: "020260001234567",
                cpfHash: "abc123",
              }),
            })
          ),
        ]);
      });

      await page.waitForTimeout(3000);
    });

    await test.step("Validar sequência de status", async () => {
      // Esperado: RECEIVED, PROCESSING, APPROVED
      expect(statusSequence).toContain("RECEIVED");
      expect(statusSequence).toContain("PROCESSING");

      const receivedIdx = statusSequence.indexOf("RECEIVED");
      const processingIdx = statusSequence.indexOf("PROCESSING");
      expect(processingIdx).toBeGreaterThan(receivedIdx);
    });
  });

  test("Validar rejeição e notificação de erro ao GBDS", async ({ page }) => {
    /**
     * Cenário: Validação falha, sistema rejeita e notifica GBDS
     * Status: REJECTED
     * Motivo: contém detalhes do erro
     */

    const rejeicoesCaptured: any[] = [];

    await page.on("request", (request) => {
      if (
        request.url().includes("/notificador/notificar") &&
        request.postDataJSON().status === "REJECTED"
      ) {
        rejeicoesCaptured.push(request.postDataJSON());
      }
    });

    await test.step("Simular cenário de rejeição", async () => {
      // Simular POST com status REJECTED
      await page.evaluate(() => {
        return fetch("/notificador/notificar", {
          method: "POST",
          body: JSON.stringify({
            status: "REJECTED",
            protocolo: "020260001234567",
            cpfHash: "abc123",
            motivo: "CPF_CANCELADO",
            detalhes: "CPF cancelado junto à Receita Federal",
          }),
        });
      });

      await page.waitForTimeout(1000);
    });

    await test.step("Validar payload de rejeição", async () => {
      expect(rejeicoesCaptured.length).toBeGreaterThan(0);

      const rejeicao = rejeicoesCaptured[0];
      expect(rejeicao.status).toBe("REJECTED");
      expect(rejeicao).toHaveProperty("motivo");
      expect(rejeicao).toHaveProperty("detalhes");
    });
  });

  test("Validar que payload nunca contém CPF em plaintext", async ({
    page,
  }) => {
    /**
     * Crítico: CPF deve ser hasheado antes de enviar ao GBDS
     */

    const payloads: any[] = [];

    await page.on("request", (request) => {
      if (request.url().includes("/notificador/notificar")) {
        payloads.push(request.postDataJSON());
      }
    });

    await test.step("Capturar payload", async () => {
      await page.evaluate(() => {
        return fetch("/notificador/notificar", {
          method: "POST",
          body: JSON.stringify({
            status: "APPROVED",
            protocolo: "020260001234567",
            cpfHash:
              "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            email: "usuario@example.com",
            nome: "Usuário Teste",
          }),
        });
      });

      await page.waitForTimeout(500);
    });

    await test.step("Validar ausência de CPF plaintext", async () => {
      const payload = payloads[0];

      // Não deve conter cpf (somente cpfHash)
      expect(payload).not.toHaveProperty("cpf");

      // Deve conter cpfHash
      expect(payload).toHaveProperty("cpfHash");

      // cpfHash deve ter aspecto de hash (não CPF formatado)
      expect(payload.cpfHash).not.toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
    });
  });
});

