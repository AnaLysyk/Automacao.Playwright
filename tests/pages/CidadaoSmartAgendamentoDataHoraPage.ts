import { expect, Page } from '@playwright/test';
import { CidadaoSmartAgendamentoDataHoraPageSelectors as S } from './selectors/CidadaoSmartAgendamentoDataHoraPageSelectors';

/**
 * Page Object - Tela de Data e Hora do Agendamento Presencial
 * 
 * Esta tela permite ao usuário:
 * 1. Preencher dados do requerente (nome, data de nascimento, CPF, telefone, email)
 * 2. Selecionar data do agendamento
 * 3. Selecionar horário de atendimento
 * 4. Prosseguir para o resumo
 */
export class CidadaoSmartAgendamentoDataHoraPage {
  constructor(private readonly page: Page) {}

  /**
   * Valida que a tela de data/hora está carregada corretamente
   * Verifica: URL, título e abas visíveis
   */
  async validarTelaDataHora(): Promise<void> {
    await expect(this.page).toHaveURL(S.route);
    await expect(this.page.getByText('Data e Hora', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Requerente', { exact: true })).toBeVisible();
  }

  /**
   * Preenche o campo de nome do requerente
   * 
   * @param nome Nome completo (deve ter pelo menos 2 palavras)
   */
  async preencherNome(nome: string): Promise<void> {
    await this.page.getByPlaceholder('Digite...').fill(nome);
  }

  /**
   * Preenche a data de nascimento
   * 
   * Formato: DD/MM/AAAA (ex: 15/03/1990)
   * Validações:
   * - Não permite menor de 16 anos
   * - Não permite data futura
   * 
   * @param dataNascimento Data no formato DD/MM/AAAA
   */
  async preencherDataNascimento(dataNascimento: string): Promise<void> {
    await this.page.getByPlaceholder('DD/MM/AAAA').fill(dataNascimento);
  }

  /**
   * Preenche o email do requerente
   * 
   * @param email Email válido
   */
  async preencherEmail(email: string): Promise<void> {
    await this.page.getByPlaceholder('Exemplo@email.com.br').fill(email);
  }

  /**
   * Preenche o CPF do requerente
   * 
   * Nota: CPF é opcional, mas se preenchido deve ser válido
   * 
   * @param cpf CPF com ou sem formatação
   */
  async preencherCpf(cpf: string): Promise<void> {
    await this.page.getByPlaceholder('000.000.000-00').fill(cpf);
  }

  /**
   * Preenche o telefone do requerente
   * 
   * Campo obrigatório com formatação (48) XXXXX-XXXX
   * 
   * @param telefone Telefone com DDD
   */
  async preencherTelefone(telefone: string): Promise<void> {
    await this.page.locator('input[placeholder*="48"]').fill(telefone);
  }

  /**
   * Seleciona uma data específica no calendário
   * 
   * IMPORTANTE: A tela de data é modal e não permite digitação direta.
   * A seleção deve ser feita via clique no calendário.
   * 
   * @param dataAgendamento Data no formato DD/MM/YYYY
   */
  async selecionarData(dataAgendamento: string): Promise<void> {
    const [dia] = dataAgendamento.split('/');
    const diaSemZero = String(Number(dia));

    // Clica no campo "Selecione" para abrir o modal de data
    await this.page.getByText('Selecione', { exact: true }).first().click();

    // Aguarda o modal abrir
    await expect(this.page.getByText(/data de agendamento/i)).toBeVisible();

    // Seleciona o dia desejado no calendário
    await this.page
      .getByRole('button', { name: new RegExp(`^${diaSemZero}$`) })
      .click();

    // Confirma a data selecionada
    await this.page.getByRole('button', { name: /confirmar/i }).last().click();

    // Aguarda o modal fechar
    await expect(this.page.getByText(/data de agendamento/i)).toBeHidden();
  }

  async abrirModalHorario(): Promise<void> {
    await this.page.getByText('Selecione', { exact: true }).first().click();
    await expect(this.page.getByText(S.tituloModalHorario)).toBeVisible();
  }

  async selecionarHorario(horario: string): Promise<void> {
    await this.page
      .getByRole('button', { name: new RegExp(`^${horario}$`) })
      .click();
  }

  async confirmarHorario(): Promise<void> {
    await this.page.getByRole('button', { name: S.botaoConfirmar }).last().click();
  }

  async selecionarHorarioAgendado(horario: string): Promise<void> {
    // Depois que a data foi escolhida, o "Selecione" restante é o campo de horário.
    await this.page.getByText('Selecione', { exact: true }).first().click();

    // Aguarda abrir o modal de horário.
    await expect(this.page.getByText(/horário de atendimento/i)).toBeVisible();

    // Seleciona o horário disponível.
    await this.page
      .getByRole('button', { name: new RegExp(`^${horario}$`) })
      .click();

    // Confirma o horário selecionado.
    await this.page.getByRole('button', { name: /confirmar/i }).last().click();

    // Aguarda o modal de horário fechar.
    await expect(this.page.getByText(/horário de atendimento/i)).toBeHidden();
  }

  async prosseguir(): Promise<void> {
    const botaoProsseguir = this.page.getByRole('button', {
      name: S.botaoProsseguir,
    });

    await expect(botaoProsseguir).toBeVisible();
    await expect(botaoProsseguir).toBeEnabled();

    await botaoProsseguir.click();
  }

  async validarMensagemNomeSobrenome(): Promise<void> {
    await expect(this.page.getByText(S.mensagemNomeSobrenome)).toBeVisible();
  }

  async validarTelefoneObrigatorio(): Promise<void> {
    await expect(this.page.getByText(S.mensagemTelefoneObrigatorio)).toBeVisible();
  }

  async validarErroDataInvalida(): Promise<void> {
    await expect(this.page.getByText(S.mensagemDataInvalida)).toBeVisible();
  }

  async validarErroMenorIdade(): Promise<void> {
    await expect(this.page.getByText(S.mensagemMenorIdade)).toBeVisible();
  }
}