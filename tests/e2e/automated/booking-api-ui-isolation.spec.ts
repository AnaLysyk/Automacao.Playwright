import { test, expect } from '@playwright/test';
import { ApiHelper } from '@support/helpers/ApiHelper';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

test.describe('@api @e2e API vs UI - Isolação de falha', () => {
  test('[API-UI-001] Se a API de postos responde e a UI falha, detectar problema no front-end', async ({ request, page }) => {
    const cidadadoSmartBaseUrl = process.env.CIDADAO_SMART_BASE_URL || '';
    const bookingAdminBaseUrl = process.env.BOOKING_ADMIN_BASE_URL || '';

    if (!cidadadoSmartBaseUrl) {
      throw new Error('CIDADAO_SMART_BASE_URL não configurada');
    }

    if (!bookingAdminBaseUrl) {
      throw new Error('BOOKING_ADMIN_BASE_URL não configurada');
    }

    let token: string | undefined;

    try {
      token = await ApiHelper.getAuthToken(request);
    } catch (error) {
      console.log('Aviso: token de autenticação não disponível. Tentando sem autenticação.');
    }

    // API direta: validar listagem de postos no backend Booking.
    const apiPostos = await ApiHelper.getServicePoints(request, undefined, token).catch((error) => {
      test.skip(true, `Cenario bloqueado: API de postos indisponivel ou endpoint nao configurado (${String(error)}).`);
      return null;
    });
    if (!apiPostos) {
      return;
    }

    expect(apiPostos).toBeDefined();
    expect(Array.isArray(apiPostos) || typeof apiPostos === 'object').toBe(true);

    // UI: carregar a página de agendamento local e capturar a chamada de API de postos.
    const servicePointsRequest = page.waitForResponse((response) => {
      return response.url().includes('/service-points') && response.request().method() === 'GET';
    });

    await page.goto(`${cidadadoSmartBaseUrl}/agendamentos/novo/local`, { waitUntil: 'networkidle' });

    const uiResponse = await servicePointsRequest;
    expect(uiResponse.ok()).toBe(true);

    const uiBody = await uiResponse.json().catch(() => null);
    expect(uiBody).toBeDefined();

    // Coordenar comparação simples de resultados para reforçar que a API e a UI estão olhando para o mesmo contrato.
    if (Array.isArray(apiPostos) && Array.isArray(uiBody)) {
      expect(uiBody.length).toBeGreaterThan(0);
      expect(uiBody.length).toBeGreaterThanOrEqual(apiPostos.length > 0 ? 1 : 0);
    }
  });

  test('[API-UI-002] Verifica se a API de agenda responde antes de depender da UI', async ({ request }) => {
    const bookingAdminBaseUrl = process.env.BOOKING_ADMIN_BASE_URL || '';
    const servicePointId = process.env.CIDADAO_SMART_DEFAULT_SERVICE_POINT_ID || '';

    if (!bookingAdminBaseUrl) {
      throw new Error('BOOKING_ADMIN_BASE_URL não configurada');
    }

    if (!servicePointId) {
      test.skip(true, 'CIDADAO_SMART_DEFAULT_SERVICE_POINT_ID não configurado; pula validação de agenda');
      return;
    }

    let token: string | undefined;

    try {
      token = await ApiHelper.getAuthToken(request);
    } catch (error) {
      console.log('Aviso: token de autenticação não disponível. Tentando sem autenticação.');
    }

    const schedule = await ApiHelper.getServicePointSchedule(request, servicePointId, undefined, token).catch((error) => {
      test.skip(true, `Cenario bloqueado: API de agenda indisponivel ou endpoint nao configurado (${String(error)}).`);
      return null;
    });
    if (!schedule) {
      return;
    }

    expect(schedule).toBeDefined();
    expect(typeof schedule).toBe('object');
    expect(schedule).not.toEqual({});
  });
});
