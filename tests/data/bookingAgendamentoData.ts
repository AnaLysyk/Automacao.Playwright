import '../config/env';

export type BookingAgendamentoData = {
  cidade: string;
  postoPreferido: string;
  postoPreferidoId: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  dataAgendamento: string;
  horario: string;
  permitirPrimeiraDataDisponivel: boolean;
  permitirPrimeiroHorarioDisponivel: boolean;
};

// Eu calculo uma data futura para a massa demo não depender de uma data fixa vencida.
function getFutureDate(daysAhead = 5): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// Eu leio booleanos da massa permitindo trocar estratégia sem alterar código.
function readBoolean(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (!raw) return fallback;

  return raw.trim().toLowerCase() === 'true';
}

// Eu concentro a massa demo do Booking para o agente usar sempre uma fonte única.
export const bookingAgendamentoData: BookingAgendamentoData = {
  cidade: process.env.CIDADAO_SMART_DEFAULT_CITY || 'Florianópolis',
  postoPreferido: process.env.CIDADAO_SMART_DEFAULT_SERVICE_POINT || 'PCI - FLORIANÓPOLIS - Top Tower',
  postoPreferidoId: process.env.CIDADAO_SMART_DEFAULT_SERVICE_POINT_ID || 'top-tower',
  nome: process.env.CIDADAO_SMART_TEST_NAME || 'Automacao Assistida',
  cpf: process.env.CIDADAO_SMART_TEST_CPF || '',
  dataNascimento: process.env.CIDADAO_SMART_TEST_BIRTH_DATE || '01/01/1990',
  email: process.env.CIDADAO_SMART_TEST_EMAIL || 'qa-booking@example.com',
  telefone: process.env.CIDADAO_SMART_TEST_PHONE || '(55) 55555-5555',
  dataAgendamento: process.env.CIDADAO_SMART_TEST_APPOINTMENT_DATE || getFutureDate(5),
  horario: process.env.CIDADAO_SMART_TEST_APPOINTMENT_TIME || process.env.PREFERRED_TIME || '08:00',
  permitirPrimeiraDataDisponivel: readBoolean('BOOKING_ALLOW_FIRST_AVAILABLE_DATE', true),
  permitirPrimeiroHorarioDisponivel: readBoolean('BOOKING_ALLOW_FIRST_AVAILABLE_TIME', true),
};
