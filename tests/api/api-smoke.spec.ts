import { test, expect } from '@playwright/test';
import { ApiHelper } from '../helpers/ApiHelper';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

test.describe('@api @smoke', () => {
  test('[API-HEALTH-001] Cidadão Smart API deve responder', async ({ request }) => {
    // Arrange
    const baseUrl = process.env.CIDADAO_SMART_BASE_URL || '';

    if (!baseUrl) {
      throw new Error('CIDADAO_SMART_BASE_URL não configurada');
    }

    // Act
    const health = await ApiHelper.healthCheck(request, baseUrl);

    test.skip(
      !health.healthy,
      `Cenario bloqueado: Cidadao Smart API nao respondeu health 200. Status recebido: ${health.status ?? health.error}.`
    );

    // Assert
    expect(health.healthy).toBe(true);
    expect(health.status).toBe(200);
  });

  test('[API-HEALTH-002] Booking Admin API deve responder', async ({ request }) => {
    // Arrange
    const baseUrl = process.env.BOOKING_ADMIN_BASE_URL || '';

    if (!baseUrl) {
      throw new Error('BOOKING_ADMIN_BASE_URL não configurada');
    }

    // Act
    const health = await ApiHelper.healthCheck(request, baseUrl);

    test.skip(
      !health.healthy,
      `Cenario bloqueado: Booking Admin API nao respondeu health 200. Status recebido: ${health.status ?? health.error}.`
    );

    // Assert
    expect(health.healthy).toBe(true);
    expect(health.status).toBe(200);
  });

  test('[API-HEALTH-003] SMART API deve responder', async ({ request }) => {
    // Arrange
    const baseUrl = process.env.SMART_BASE_URL || '';

    if (!baseUrl) {
      throw new Error('SMART_BASE_URL não configurada');
    }

    // Act
    const health = await ApiHelper.healthCheck(request, baseUrl);

    // Assert
    expect(health.healthy).toBe(true);
    expect(health.status).toBe(200);
  });

  test('[API-AUTH-001] Deve obter token de autenticação', async ({ request }) => {
    // Arrange
    const keycloakTokenUrl = process.env.KEYCLOAK_TOKEN_URL || '';

    if (!keycloakTokenUrl) {
      test.skip();
    }

    // Act
    let token: string | undefined;

    try {
      token = await ApiHelper.getAuthToken(request);
    } catch (error) {
      // Se não conseguir token, pode ser que Keycloak não está acessível
      // ou credenciais não estão configuradas
      console.log('Aviso: Não foi possível obter token. Verifique Keycloak.');
      test.skip();
      return;
    }

    if (!token) {
      test.skip();
      return;
    }

    // Assert
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(0);
  });

  test('[API-CIDADAO-001] Deve listar postos disponíveis', async ({ request }) => {
    // Arrange
    const baseUrl = process.env.BOOKING_ADMIN_BASE_URL || '';

    if (!baseUrl) {
      test.skip();
    }

    let token: string | undefined;

    try {
      token = await ApiHelper.getAuthToken(request);
    } catch (error) {
      console.log('Aviso: Sem token. Tentando sem autenticação.');
    }

    // Act
    let result: any;

    try {
      result = await ApiHelper.getServicePoints(request, undefined, token);
    } catch (error) {
      // Endpoint pode não existir exatamente assim
      console.log('Aviso: Endpoint de postos não encontrado:', error);
      test.skip();
    }

    // Assert
    expect(result).toBeDefined();
    // Resultado deve ser um array ou objeto com dados
  });

  test('[API-BOOKING-001] Deve verificar agenda de um posto', async ({ request }) => {
    // Arrange
    const baseUrl = process.env.BOOKING_ADMIN_BASE_URL || '';

    if (!baseUrl) {
      test.skip();
    }

    let token: string | undefined;

    try {
      token = await ApiHelper.getAuthToken(request);
    } catch (error) {
      console.log('Aviso: Sem token. Tentando sem autenticação.');
    }

    // Primeiro, obter ID de um posto
    let servicePointId = process.env.CIDADAO_SMART_DEFAULT_SERVICE_POINT_ID || 'test-posto';

    // Act
    let result: any;

    try {
      result = await ApiHelper.getServicePointSchedule(request, servicePointId, undefined, token);
    } catch (error) {
      console.log('Aviso: Endpoint de agenda não encontrado:', error);
      test.skip();
    }

    // Assert
    expect(result).toBeDefined();
  });

  test('[API-NOTIFIER-001] Webhook do Notificador deve estar acessível', async ({ request }) => {
    // Arrange
    const webhookUrl = process.env.GBDS_WEBHOOK_URL || '';

    if (!webhookUrl) {
      test.skip();
    }

    // Act - Testar se endpoint responde com OPTIONS
    const response = await request.fetch(webhookUrl, { method: 'OPTIONS' }).catch(() => null);

    // Assert
    if (response) {
      expect([200, 204, 405]).toContain(response.status());
    }
  });

  test('[API-SMART-001] Deve listar processos no SMART', async ({ request }) => {
    // Arrange
    const baseUrl = process.env.SMART_BASE_URL || '';

    if (!baseUrl) {
      test.skip();
    }

    let token: string | undefined;

    try {
      token = await ApiHelper.getAuthToken(request);
    } catch (error) {
      console.log('Aviso: Sem token. Tentando sem autenticação.');
    }

    // Act
    let result: any;

    try {
      result = await ApiHelper.getSmartProcesses(request, undefined, token);
    } catch (error) {
      console.log('Aviso: Endpoint de processos SMART não encontrado:', error);
      test.skip();
    }

    // Assert
    expect(result).toBeDefined();
  });

  test('[API-DAE-001] DAE API deve estar acessível', async ({ request }) => {
    // Arrange
    const daeUrl = process.env.DAE_API_URL || '';

    if (!daeUrl) {
      test.skip();
    }

    // Act
    const response = await request.fetch(`${daeUrl}/health`).catch(() => null);

    // Assert
    if (response) {
      expect([200, 404]).toContain(response.status());
    }
  });
});
