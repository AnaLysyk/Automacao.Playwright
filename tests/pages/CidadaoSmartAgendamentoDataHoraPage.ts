import { expect, Page } from '@playwright/test';
import { CidadaoSmartAgendamentoDataHoraPageSelectors as S } from './selectors/CidadaoSmartAgendamentoDataHoraPageSelectors';

/**
 * Eu concentro aqui tudo que a tela Data e Hora sabe fazer:
 * preencher requerente, escolher data, escolher horario e seguir para o resumo.
 */
export class CidadaoSmartAgendamentoDataHoraPage {
  constructor(private readonly page: Page) {}

  /**
   * Eu valido que estou na tela certa antes de preencher qualquer dado.
   */
  async validarTelaDataHora(): Promise<void> {
    await expect(this.page).toHaveURL(S.route);
    await expect(this.page.getByText('Data e Hora', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Requerente', { exact: true })).toBeVisible();
  }

  /**
   * Eu preencho o nome completo do requerente.
   */
  async preencherNome(nome: string): Promise<void> {
    await this.page.getByPlaceholder('Digite...').fill(nome);
  }

  /**
   * Eu preencho a data de nascimento no formato esperado pela tela.
   */
  async preencherDataNascimento(dataNascimento: string): Promise<void> {
    await this.page.getByPlaceholder('DD/MM/AAAA').fill(dataNascimento);
  }

  /**
   * Eu preencho o e-mail usado para comunicacao e codigo.
   */
  async preencherEmail(email: string): Promise<void> {
    await this.page.getByPlaceholder('Exemplo@email.com.br').fill(email);
  }

  /**
   * Eu preencho o CPF quando o cenario pede esse dado.
   */
  async preencherCpf(cpf: string): Promise<void> {
    await this.page.getByPlaceholder('000.000.000-00').fill(cpf);
  }

  /**
   * Eu preencho o telefone obrigatorio do requerente.
   */
  async preencherTelefone(telefone: string): Promise<void> {
    await this.page.locator('input[placeholder*="48"]').fill(telefone);
  }

  /**
   * Eu abro o calendario e tento escolher a data preferida.
   * Se ela nao estiver habilitada, eu pego a primeira data disponivel.
   */
  async selecionarData(dataAgendamento: string): Promise<string> {
    const [dia] = dataAgendamento.split('/');
    const diaSemZero = String(Number(dia));

    // Eu abro o modal de data pelo campo "Selecione".
    await this.page.getByText('Selecione', { exact: true }).first().click();

    // Eu espero o calendario ficar visivel antes de clicar em qualquer dia.
    await expect(this.page.getByText(/data de agendamento/i)).toBeVisible();

    const mensagemSemVagas = this.page.getByText(/nao ha vagas|sem vagas disponiveis|nenhuma vaga disponivel|não há vagas|sem vagas disponíveis|nenhuma vaga disponível/i);
    if ((await mensagemSemVagas.count()) > 0 && (await mensagemSemVagas.first().isVisible())) {
      throw new Error('Nenhuma disponibilidade de data encontrada para o posto selecionado.');
    }

    const diaBotao = this.page.getByRole('button', { name: new RegExp(`^${diaSemZero}$`) }).first();
    let dataSelecionada = dataAgendamento;
    if (await diaBotao.count() > 0 && (await diaBotao.isEnabled())) {
      await diaBotao.click();
    } else {
      const opcoes = this.page.getByRole('button').filter({ hasText: /^[0-9]+$/ });
      const quantidade = await opcoes.count();
      let escolhido = false;

      for (let i = 0; i < quantidade; i += 1) {
        const opcao = opcoes.nth(i);
        if (await opcao.isEnabled()) {
          dataSelecionada = (await opcao.innerText()).trim() || 'primeira data disponivel';
          await opcao.click();
          escolhido = true;
          break;
        }
      }

      if (!escolhido) {
        throw new Error('Nao foi possivel encontrar uma data habilitada para agendamento.');
      }
    }

    // Eu trato builds que confirmam automaticamente e builds que exigem Confirmar.
    const botaoConfirmarData = this.page.getByRole('button', { name: /confirmar/i }).last();
    const confirmacaoManualVisivel = await botaoConfirmarData
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => true)
      .catch(() => false);

    if (confirmacaoManualVisivel && (await botaoConfirmarData.isEnabled())) {
      await botaoConfirmarData.click();
    }

    // Eu espero o modal fechar para garantir que a data ficou aplicada.
    await expect(this.page.getByText(/data de agendamento/i)).toBeHidden({ timeout: 10_000 });
    return dataSelecionada;
  }

  /**
   * Eu abro o modal onde a tela lista os horarios disponiveis.
   */
  async abrirModalHorario(): Promise<void> {
    await this.page.getByText('Selecione', { exact: true }).last().click();
    await expect(this.page.getByText(S.tituloModalHorario, { exact: true }).first()).toBeVisible();
  }

  /**
   * Eu tento escolher o horario preferido e, se ele nao estiver disponivel,
   * uso o primeiro horario habilitado.
   */
  async selecionarHorario(horario: string): Promise<string> {
    const horarioBotao = this.page.getByRole('button', { name: new RegExp(`^${horario}$`) }).first();

    if (await horarioBotao.count() > 0 && (await horarioBotao.isEnabled())) {
      await horarioBotao.click();
      return horario;
    }

    const opcoes = this.page.getByRole('button').filter({ hasText: /[0-9]{2}:[0-9]{2}/ });
    const quantidade = await opcoes.count();
    let escolhido = false;
    let horarioSelecionado = '';

    for (let i = 0; i < quantidade; i += 1) {
      const opcao = opcoes.nth(i);
      if (await opcao.isEnabled()) {
        horarioSelecionado = (await opcao.innerText()).trim();
        await opcao.click();
        escolhido = true;
        break;
      }
    }

    if (!escolhido) {
      throw new Error('Nao foi possivel encontrar um horario habilitado para agendamento.');
    }

    return horarioSelecionado || 'primeiro horario disponivel';
  }

  /**
   * Eu confirmo o horario selecionado no modal e espero ele fechar.
   */
  async confirmarHorario(): Promise<void> {
    const tituloModal = this.page.getByText(S.tituloModalHorario, { exact: true }).first();
    const botaoConfirmarHorario = this.page.getByText(/^Confirmar$/i).last();

    if (await tituloModal.isHidden().catch(() => false)) {
      return;
    }

    await botaoConfirmarHorario.click({ timeout: 10_000, force: true });
    await expect(tituloModal).toBeHidden({ timeout: 10_000 });
  }

  /**
   * Eu mantenho este metodo legado para specs antigas que selecionam horario direto.
   */
  async selecionarHorarioAgendado(horario: string): Promise<void> {
    await this.page.getByText('Selecione', { exact: true }).first().click();
    await expect(this.page.getByText(/horario de atendimento|horário de atendimento/i)).toBeVisible();
    await this.page
      .getByRole('button', { name: new RegExp(`^${horario}$`) })
      .click();
    await this.page.getByRole('button', { name: /confirmar/i }).last().click();
    await expect(this.page.getByText(/horario de atendimento|horário de atendimento/i)).toBeHidden();
  }

  /**
   * Eu avanço da tela Data e Hora para o resumo somente quando o botao estiver habilitado.
   */
  async prosseguir(): Promise<void> {
    const botaoProsseguir = this.page.getByRole('button', {
      name: S.botaoProsseguir,
    });

    await expect(botaoProsseguir).toBeVisible();
    await expect(botaoProsseguir).toBeEnabled();

    await botaoProsseguir.click();
  }

  /**
   * Eu valido a mensagem de erro para nome sem sobrenome.
   */
  async validarMensagemNomeSobrenome(): Promise<void> {
    await expect(this.page.getByText(S.mensagemNomeSobrenome)).toBeVisible();
  }

  /**
   * Eu valido a mensagem de telefone obrigatorio.
   */
  async validarTelefoneObrigatorio(): Promise<void> {
    await expect(this.page.getByText(S.mensagemTelefoneObrigatorio)).toBeVisible();
  }

  /**
   * Eu valido a mensagem de data invalida.
   */
  async validarErroDataInvalida(): Promise<void> {
    await expect(this.page.getByText(S.mensagemDataInvalida)).toBeVisible();
  }

  /**
   * Eu valido a regra de idade minima do requerente.
   */
  async validarErroMenorIdade(): Promise<void> {
    await expect(this.page.getByText(S.mensagemMenorIdade)).toBeVisible();
  }
}
