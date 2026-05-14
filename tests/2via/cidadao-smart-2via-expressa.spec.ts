import { test, expect } from "@playwright/test";
import { cidadaoSmartTestMass, statusProcesso2Via } from "../support/data/cidadaoSmartMass";
import { CidadaoSmartAgendamentoLocalPage } from "../pages/CidadaoSmartAgendamentoLocalPage";
import { CidadaoSmartAgendamentoDataHoraPage } from "../pages/CidadaoSmartAgendamentoDataHoraPage";
import { CidadaoSmartAgendamentoResumoPage } from "../pages/CidadaoSmartAgendamentoResumoPage";
import { CidadaoSmartAgendamentoAutenticacaoPage } from "../pages/CidadaoSmartAgendamentoAutenticacaoPage";
import { CidadaoSmartAgendamentoConfirmacaoPage } from "../pages/CidadaoSmartAgendamentoConfirmacaoPage";
import { handleCaptcha } from "../support/captcha/handleCaptcha";
import { chegarNaTelaDataHora, chegarNaTelaResumo } from "../support/flows/cidadaoSmartFlows";

test.describe("Cidadão Smart - 2ª Via Expressa", () => {
  test.beforeEach(async ({ page }) => {
    test.step("Pausar no CAPTCHA manual para resolução", async () => {
      console.log("ℹ️  Configure CAPTCHA_MODE=disabled para rodar sem pausa");
    });
  });

  test("Fluxo feliz 2ª via expressa - Elegível", async ({ page }) => {
    const requerente = {
      nome: cidadaoSmartTestMass.elegivel2ViaExpressa.nome,
      dataNascimento: cidadaoSmartTestMass.elegivel2ViaExpressa.dataNascimento,
      email: cidadaoSmartTestMass.elegivel2ViaExpressa.email,
      cpf: cidadaoSmartTestMass.elegivel2ViaExpressa.cpf,
      telefone: cidadaoSmartTestMass.elegivel2ViaExpressa.telefone,
    };

    await test.step("1. Acessar tela de Local", async () => {
      const localPage = new CidadaoSmartAgendamentoLocalPage(page);
      await localPage.acessar();
      await localPage.validarTelaLocal();
    });

    await test.step("2. Buscar cidade e selecionar Florianópolis", async () => {
      const localPage = new CidadaoSmartAgendamentoLocalPage(page);
      await localPage.buscarPorCidade("Florianópolis");
      await localPage.selecionarCidade("Florianópolis");
    });

    await test.step("3. Selecionar posto Top Tower", async () => {
      const localPage = new CidadaoSmartAgendamentoLocalPage(page);
      await localPage.selecionarPosto("PCI - FLORIANÓPOLIS - Top Tower");
      await localPage.validarQueNaoSelecionouPostoErrado();
    });

    await test.step("4. Resolver CAPTCHA", async () => {
      await handleCaptcha(page);
    });

    await test.step("5. Prosseguir para Data e Hora", async () => {
      const localPage = new CidadaoSmartAgendamentoLocalPage(page);
      await localPage.prosseguir();
    });

    await test.step("6. Preencher dados do requerente", async () => {
      const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
      await dataHoraPage.validarTelaDataHora();
      await dataHoraPage.preencherNome(requerente.nome);
      await dataHoraPage.preencherDataNascimento(requerente.dataNascimento);
      await dataHoraPage.preencherEmail(requerente.email);
      await dataHoraPage.preencherCpf(requerente.cpf);
      await dataHoraPage.preencherTelefone(requerente.telefone);
    });

    await test.step("7. Selecionar data e horário", async () => {
      const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
      await dataHoraPage.selecionarData("18/05/2026");
      await dataHoraPage.selecionarHorarioAgendado("08:00");
    });

    await test.step("8. Prosseguir para Resumo", async () => {
      const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
      await dataHoraPage.prosseguir();
    });

    await test.step("9. Validar dados no Resumo", async () => {
      const resumoPage = new CidadaoSmartAgendamentoResumoPage(page);
      await resumoPage.validarDadosResumo({
        nome: requerente.nome,
        cpf: requerente.cpf,
        dataNascimento: requerente.dataNascimento,
        email: requerente.email,
        telefone: requerente.telefone,
        dataAgendamento: "18/05/2026",
        horario: "08:00",
        posto: "PCI - FLORIANÓPOLIS - Top Tower",
        endereco: "Rua Esteves Júnior, 50",
      });
    });

    await test.step("10. Prosseguir para Autenticação", async () => {
      const resumoPage = new CidadaoSmartAgendamentoResumoPage(page);
      await resumoPage.prosseguir();
    });

    await test.step("11. Validar tela de Autenticação", async () => {
      const autenticacaoPage =
        new CidadaoSmartAgendamentoAutenticacaoPage(page);
      await autenticacaoPage.validarTelaAutenticacao();
      await expect(page.locator("text=Código de segurança enviado")).toBeVisible();
    });

    await test.step("12. Preencher código de segurança", async () => {
      const codigoSeguranca =
        process.env.CIDADAO_SMART_SECURITY_CODE || "111030";
      const autenticacaoPage =
        new CidadaoSmartAgendamentoAutenticacaoPage(page);
      await autenticacaoPage.preencherCodigoSeguranca(codigoSeguranca);
      await autenticacaoPage.verificarCodigo();
    });

    await test.step("13. Validar código validado", async () => {
      const autenticacaoPage =
        new CidadaoSmartAgendamentoAutenticacaoPage(page);
      // Metodo atual do Page Object para sucesso de validacao do codigo.
      await autenticacaoPage.validarCodigoValidado();
      await autenticacaoPage.prosseguir();
    });

    await test.step("14. Validar confirmação do agendamento", async () => {
      const confirmacaoPage =
        new CidadaoSmartAgendamentoConfirmacaoPage(page);
      await confirmacaoPage.validarTelaConfirmacao();
      await expect(page.locator("text=Agendamento confirmado")).toBeVisible();
    });

    await test.step("15. Validar protocolo dinâmico", async () => {
      const confirmacaoPage =
        new CidadaoSmartAgendamentoConfirmacaoPage(page);
      const protocolo = await confirmacaoPage.obterProtocolo();
      expect(protocolo).toMatch(/02026\d{7,}/);
    });

    await test.step("16. Validar dados finais não descartam documentos", async () => {
      const confirmacaoPage =
        new CidadaoSmartAgendamentoConfirmacaoPage(page);
      await confirmacaoPage.validarDadosConfirmacao({
        nome: requerente.nome,
        cpf: requerente.cpf,
        dataNascimento: requerente.dataNascimento,
        email: requerente.email,
        telefone: requerente.telefone,
        dataAgendamento: "18/05/2026",
        horario: "08:00",
        posto: "PCI - FLORIANÓPOLIS - Top Tower",
        endereco: "Rua Esteves Júnior, 50",
      });
    });
  });

  test("Validar rejeição de menor de 16 anos", async ({ page }) => {
    const requerente = cidadaoSmartTestMass.menorDe16Anos;

    await test.step("Chegar na tela Data e Hora", async () => {
      const localPage = new CidadaoSmartAgendamentoLocalPage(page);
      await localPage.acessar();
      await localPage.buscarPorCidade("Florianópolis");
      await localPage.selecionarCidade("Florianópolis");
      await localPage.selecionarPosto("PCI - FLORIANÓPOLIS - Top Tower");
      await handleCaptcha(page);
      await localPage.prosseguir();
    });

    await test.step("Tentar preencher dados de menor", async () => {
      const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
      await dataHoraPage.preencherNome(requerente.nome);
      await dataHoraPage.preencherDataNascimento(requerente.dataNascimento);
      await dataHoraPage.preencherEmail("menor@example.com");
      await dataHoraPage.preencherTelefone(cidadaoSmartTestMass.menorDe16Anos.telefone || "");

      // Esperar mensagem de rejeição
      await expect(
        page.locator("text=Menor de 16 anos não é elegível")
      ).toBeVisible({ timeout: 5000 });
    });
  });

  test("Validar rejeição de CPF cancelado", async ({ page }) => {
    const requerente = cidadaoSmartTestMass.ineligivel;

    await test.step("Chegar na tela Data e Hora", async () => {
      await chegarNaTelaDataHora(page);
    });

    await test.step("Tentar preencher dados de CPF cancelado", async () => {
      const dataHoraPage = new CidadaoSmartAgendamentoDataHoraPage(page);
      await dataHoraPage.preencherNome(requerente.nome);
      await dataHoraPage.preencherDataNascimento(requerente.dataNascimento);
      await dataHoraPage.preencherEmail("cancelado@example.com");
      await dataHoraPage.preencherCpf(requerente.cpf);
      await dataHoraPage.preencherTelefone(cidadaoSmartTestMass.ineligivel.telefone || "");

      // Esperar mensagem de rejeição
      await expect(
        page.locator("text=CPF cancelado junto à Receita Federal")
      ).toBeVisible({ timeout: 5000 });
    });
  });
});


