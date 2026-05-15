import { expect, Page } from '@playwright/test';
import { CidadaoSmartAgendamentoConfirmacaoPageSelectors as S } from '@support/pages/selectors/CidadaoSmartAgendamentoConfirmacaoPageSelectors';
import { ServicePoint, cidadaoSmartServicePoints } from '@support/data/cidadaoSmartServicePoints';

export type DadosConfirmacaoAgendamento = {
  nome: string;
  cpf?: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  dataAgendamento: string;
  horario: string;
  posto: string;
  endereco: string;
};

export class CidadaoSmartAgendamentoConfirmacaoPage {
  constructor(private readonly page: Page) {}

  /**
   * Confirma que a pagina final abriu e que os blocos principais estao visiveis.
   * O helper evita pegar texto escondido no menu mobile.
   */
  async validarTelaConfirmacao(): Promise<void> {
    await expect(this.page).toHaveURL(S.route);
    await this.validarTextoVisivel(S.tituloConfirmacao);
    await this.validarTextoVisivel(S.cardAgendamentos);
    await this.validarTextoVisivel(S.cardDadosRequerente);
    await this.validarTextoVisivel(S.cardPostoAtendimento);
    await this.validarTextoVisivel(S.cardHorarioFuncionamento);
  }

  async validarProtocoloGerado(): Promise<void> {
    await expect(this.page.getByText(S.protocoloRegex)).toBeVisible();
  }

  /**
   * Captura o protocolo gerado para reuso nos fluxos SMART e 2a via.
   */
  async obterProtocolo(): Promise<string> {
    const protocolo = this.page.getByText(S.protocoloRegex).first();
    await expect(protocolo).toBeVisible();
    return (await protocolo.innerText()).trim();
  }

  async validarDadosConfirmacao(dados: DadosConfirmacaoAgendamento): Promise<void> {
    await this.validarTextoVisivel(dados.nome);

    if (dados.cpf) {
      await this.validarTextoVisivel(dados.cpf);
    }

    await this.validarTextoVisivel(dados.dataNascimento);
    await this.validarTextoVisivel(dados.email);
    await this.validarTextoVisivel(dados.telefone);
    await this.validarTextoVisivel(dados.dataAgendamento);
    await this.validarTextoVisivel(dados.horario);
    await this.validarTextoVisivel(dados.posto);
    await this.validarTextoVisivel(dados.endereco);
  }

  async obterPostoAtendimentoVisivel(): Promise<string | undefined> {
    for (const servicePoint of cidadaoSmartServicePoints) {
      const locator = this.page.getByText(servicePoint.nome).first();
      if ((await locator.count()) > 0 && (await locator.isVisible().catch(() => false))) {
        return servicePoint.nome;
      }
    }

    const aeroporto = this.page.getByText(/aeroporto/i).first();
    if ((await aeroporto.count()) > 0 && (await aeroporto.isVisible().catch(() => false))) {
      return (await aeroporto.innerText()).trim();
    }

    return undefined;
  }

  async validarPostoSelecionado(servicePoint: ServicePoint): Promise<void> {
    await this.validarTextoVisivel(servicePoint.nome);
    await this.validarTextoVisivel(servicePoint.enderecoParcial);

    if (servicePoint.email) {
      await this.validarTextoVisivel(servicePoint.email).catch(() => undefined);
    }

    if (servicePoint.telefone) {
      await this.validarTextoVisivel(servicePoint.telefone).catch(() => undefined);
    }

    for (const other of cidadaoSmartServicePoints.filter((sp) => sp.id !== servicePoint.id)) {
      await expect(this.page.getByText(other.nome)).toHaveCount(0);
    }
  }

  async validarAcoesFinais(): Promise<void> {
    await expect(this.page.getByRole('button', { name: S.botaoBaixarGuia })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoPaginaInicial })).toBeVisible();
    await expect(this.page.getByRole('button', { name: S.botaoCancelar })).toBeVisible();
  }

  /**
   * Procura texto visivel em todos os matches, ignorando elementos ocultos.
   */
  private async validarTextoVisivel(texto: string | RegExp): Promise<void> {
    const locator = this.page.getByText(texto);

    await expect
      .poll(
        async () => {
          const count = await locator.count();
          for (let index = 0; index < count; index += 1) {
            if (await locator.nth(index).isVisible().catch(() => false)) {
              return true;
            }
          }

          return false;
        },
        { timeout: 45_000 }
      )
      .toBe(true);
  }
}
