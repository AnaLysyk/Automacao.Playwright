import { cidadaoSmartServicePoints, ServicePoint } from './cidadaoSmartServicePoints';

/**
 * Resolve o posto padrão do teste por variável de ambiente.
 * Permite trocar posto da demo sem alterar código dos specs.
 */
export function getServicePointForTest(): ServicePoint {
  const byId = process.env.CIDADAO_SMART_DEFAULT_SERVICE_POINT_ID?.trim().toLowerCase();

  if (byId) {
    const found = cidadaoSmartServicePoints.find((sp) => sp.id.toLowerCase() === byId);
    if (found) return found;
  }

  const demoDefault = cidadaoSmartServicePoints.find((sp) => sp.usarNaDemo);
  if (demoDefault) return demoDefault;

  return cidadaoSmartServicePoints[0];
}
