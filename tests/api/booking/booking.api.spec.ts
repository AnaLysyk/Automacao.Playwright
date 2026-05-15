import { test } from '../../../support/fixtures/test';
import { bookingApi } from '../../../support/api/booking.api';

test.describe('API - Booking', () => {
  test('deve consultar postos quando API estiver configurada', async ({ env }) => {
    test.skip(!env.bookingApiBaseUrl, 'BOOKING_API_BASE_URL nao configurada.');

    await bookingApi.consultarPostos<unknown>();
  });
});
