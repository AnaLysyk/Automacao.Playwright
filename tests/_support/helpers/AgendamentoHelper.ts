/**
 * Helper de Agendamento - Seleção Inteligente de Data/Hora
 * 
 * Fornece métodos para seleção robusta de data e horário disponíveis.
 * Ideal para E2E e testes que não podem depender de data/hora fixos.
 */

import { Page, expect } from '@playwright/test';

export class AgendamentoHelper {
  constructor(private readonly page: Page) {}

  /**
   * Seleciona a primeira data disponível no calendário
   * 
   * Algoritmo:
   * 1. Abre o modal de data (clicando em "Selecione")
   * 2. Encontra o primeiro botão com um número (dia) que está habilitado
   * 3. Clica no dia
   * 4. Confirma a seleção
   * 
   * @returns A data selecionada no formato "DD/MM/YYYY" ou null se nenhuma disponível
   */
  async selecionarPrimeiraDataDisponivel(): Promise<string | null> {
    console.log('[AGENDAMENTO-HELPER] Abrindo modal de data');
    
    // Abre o modal
    await this.page.getByText('Selecione', { exact: true }).first().click();
    
    // Aguarda o modal abrir
    await expect(this.page.getByText(/data de agendamento/i)).toBeVisible();
    
    // Encontra todos os botões de dia disponíveis (não desabilitados)
    const diasDisponiveis = await this.page.locator('button:not(:disabled)').all();
    
    let dataSelecionada: string | null = null;
    
    for (const botao of diasDisponiveis) {
      const texto = await botao.textContent();
      
      // Verifica se é um número de dia (1-31)
      const dia = Number(texto?.trim());
      if (dia && dia >= 1 && dia <= 31) {
        console.log(`[AGENDAMENTO-HELPER] Selecionando dia: ${dia}`);
        await botao.click();
        dataSelecionada = String(dia);
        break;
      }
    }
    
    if (!dataSelecionada) {
      console.warn('[AGENDAMENTO-HELPER] Nenhuma data disponível encontrada');
      return null;
    }
    
    // Confirma a data
    console.log('[AGENDAMENTO-HELPER] Confirmando data selecionada');
    await this.page.getByRole('button', { name: /confirmar/i }).last().click();
    
    // Aguarda o modal fechar
    await expect(this.page.getByText(/data de agendamento/i)).toBeHidden();
    
    console.log('[AGENDAMENTO-HELPER] Data selecionada com sucesso');
    return dataSelecionada;
  }

  /**
   * Seleciona o primeiro horário disponível
   * 
   * Algoritmo:
   * 1. Abre o modal de horário (clicando em "Selecione")
   * 2. Encontra o primeiro botão com um horário (formato HH:MM)
   * 3. Clica no horário
   * 4. Confirma a seleção
   * 
   * @returns O horário selecionado no formato "HH:MM" ou null se nenhum disponível
   */
  async selecionarPrimeiroHorarioDisponivel(): Promise<string | null> {
    console.log('[AGENDAMENTO-HELPER] Abrindo modal de horário');
    
    // Abre o modal
    await this.page.getByText('Selecione', { exact: true }).first().click();
    
    // Aguarda o modal abrir
    await expect(this.page.getByText(/horário de atendimento/i)).toBeVisible();
    
    // Encontra todos os botões de horário disponíveis
    const horarioPattern = /^\d{2}:\d{2}$/;
    const botoesHorario = await this.page.locator('button').all();
    
    let horarioSelecionado: string | null = null;
    
    for (const botao of botoesHorario) {
      const texto = await botao.textContent();
      
      // Verifica se é um horário (HH:MM)
      if (texto && horarioPattern.test(texto.trim())) {
        const isDisabled = await botao.isDisabled();
        
        if (!isDisabled) {
          console.log(`[AGENDAMENTO-HELPER] Selecionando horário: ${texto.trim()}`);
          await botao.click();
          horarioSelecionado = texto.trim();
          break;
        }
      }
    }
    
    if (!horarioSelecionado) {
      console.warn('[AGENDAMENTO-HELPER] Nenhum horário disponível encontrado');
      return null;
    }
    
    // Confirma o horário
    console.log('[AGENDAMENTO-HELPER] Confirmando horário selecionado');
    await this.page.getByRole('button', { name: /confirmar/i }).last().click();
    
    // Aguarda o modal fechar
    await expect(this.page.getByText(/horário de atendimento/i)).toBeHidden();
    
    console.log('[AGENDAMENTO-HELPER] Horário selecionado com sucesso');
    return horarioSelecionado;
  }

  /**
   * Seleciona data E horário - ambos os primeiros disponíveis
   * Mais conveniente para E2E tests
   */
  async selecionarPrimeiraDataEHorarioDisponiveis(): Promise<{
    data: string | null;
    horario: string | null;
  }> {
    const data = await this.selecionarPrimeiraDataDisponivel();
    const horario = await this.selecionarPrimeiroHorarioDisponivel();
    
    return { data, horario };
  }

  /**
   * Valida que uma data específica está disponível
   * Útil para testes de regressão que precisam de data fixa
   */
  async validarDataDisponivel(dia: number): Promise<boolean> {
    console.log(`[AGENDAMENTO-HELPER] Validando disponibilidade do dia ${dia}`);
    
    // Abre o modal
    await this.page.getByText('Selecione', { exact: true }).first().click();
    
    await expect(this.page.getByText(/data de agendamento/i)).toBeVisible();
    
    // Procura pelo dia
    const botaoDia = this.page.locator(`button:has-text("${dia}")`).first();
    const existe = await botaoDia.count() > 0;
    const naoDesabilitado = existe && !(await botaoDia.isDisabled());
    
    // Fecha o modal
    await this.page.keyboard.press('Escape');
    
    console.log(
      `[AGENDAMENTO-HELPER] Dia ${dia} ${
        naoDesabilitado ? 'está disponível' : 'NÃO está disponível'
      }`
    );
    
    return naoDesabilitado;
  }

  /**
   * Valida que um horário específico está disponível
   */
  async validarHorarioDisponivel(horario: string): Promise<boolean> {
    console.log(`[AGENDAMENTO-HELPER] Validando disponibilidade do horário ${horario}`);
    
    // Abre o modal
    await this.page.getByText('Selecione', { exact: true }).last().click();
    
    await expect(this.page.getByText(/horário de atendimento/i)).toBeVisible();
    
    // Procura pelo horário
    const botaoHorario = this.page.getByRole('button', { name: new RegExp(`^${horario}$`) }).first();
    const existe = await botaoHorario.count() > 0;
    const naoDesabilitado = existe && !(await botaoHorario.isDisabled());
    
    // Fecha o modal
    await this.page.keyboard.press('Escape');
    
    console.log(
      `[AGENDAMENTO-HELPER] Horário ${horario} ${
        naoDesabilitado ? 'está disponível' : 'NÃO está disponível'
      }`
    );
    
    return naoDesabilitado;
  }

  /**
   * Tenta selecionar uma data específica.
   * Se não estiver disponível, seleciona a primeira disponível.
   * 
   * Útil para testes que têm preferência mas são resilientes.
   */
  async selecionarDataComFallback(
    dataPreferida?: string
  ): Promise<string | null> {
    if (dataPreferida) {
      const [dia] = dataPreferida.split('/');
      const diaNum = Number(dia);
      
      console.log(`[AGENDAMENTO-HELPER] Tentando data preferida: ${diaNum}`);
      const disponivel = await this.validarDataDisponivel(diaNum);
      
      if (disponivel) {
        // Abre e seleciona a data preferida
        await this.page.getByText('Selecione', { exact: true }).first().click();
        await expect(this.page.getByText(/data de agendamento/i)).toBeVisible();
        
        await this.page
          .getByRole('button', { name: new RegExp(`^${diaNum}$`) })
          .click();
        
        await this.page.getByRole('button', { name: /confirmar/i }).last().click();
        await expect(this.page.getByText(/data de agendamento/i)).toBeHidden();
        
        return String(diaNum);
      }
    }
    
    console.log('[AGENDAMENTO-HELPER] Data preferida indisponível, usando fallback');
    return this.selecionarPrimeiraDataDisponivel();
  }
}
