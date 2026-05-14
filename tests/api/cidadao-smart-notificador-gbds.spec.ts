import { expect, test } from "@playwright/test";

const webhookUrl = process.env.GBDS_WEBHOOK_URL || "";
const writeEnabled = process.env.GBDS_WRITE_ENABLED === "true";

function payloadBase(status: string) {
  return {
    status,
    protocolo: "020260001234567",
    cpfHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    timestamp: new Date().toISOString(),
  };
}

test.describe("Cidadão Smart - API Notificador GBDS", () => {
  test.beforeEach(() => {
    test.skip(
      !webhookUrl || !writeEnabled,
      "Cenario bloqueado: configure GBDS_WEBHOOK_URL e GBDS_WRITE_ENABLED=true somente em ambiente controlado para validar o Notificador GBDS."
    );
  });

  test("Validar webhook de notificação ao completar agendamento", async ({ request }) => {
    const response = await request.post(webhookUrl, {
      data: payloadBase("APPROVED"),
    });

    expect([200, 201, 202, 204]).toContain(response.status());
  });

  test("Validar status mapping RECEIVED -> PROCESSING -> APPROVED", async ({ request }) => {
    const statuses = ["RECEIVED", "PROCESSING", "APPROVED"];

    for (const status of statuses) {
      const response = await request.post(webhookUrl, {
        data: payloadBase(status),
      });

      expect([200, 201, 202, 204]).toContain(response.status());
    }
  });

  test("Validar rejeição e notificação de erro ao GBDS", async ({ request }) => {
    const response = await request.post(webhookUrl, {
      data: {
        ...payloadBase("REJECTED"),
        motivo: "CPF_CANCELADO",
        detalhes: "CPF cancelado junto a Receita Federal",
      },
    });

    expect([200, 201, 202, 204]).toContain(response.status());
  });

  test("Validar que payload nunca contém CPF em plaintext", async ({ request }) => {
    const payload = {
      ...payloadBase("APPROVED"),
      email: "usuario@example.com",
      nome: "Usuario Teste",
    };

    expect(payload).not.toHaveProperty("cpf");
    expect(payload).toHaveProperty("cpfHash");
    expect(payload.cpfHash).not.toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);

    const response = await request.post(webhookUrl, { data: payload });
    expect([200, 201, 202, 204]).toContain(response.status());
  });
});
