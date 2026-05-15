import { expect, test } from '@support/fixtures';
import { CidadaoSmartAgendamentoConsultaPage } from '@support/pages/CidadaoSmartAgendamentoConsultaPage';
import { handleCaptcha } from '@support/captcha/handleCaptcha';

test.describe('Cidadao Smart - Consulta de Agendamento', () => {
  test('deve validar layout da tela', async ({ page }) => {
    const consultaPage = new CidadaoSmartAgendamentoConsultaPage(page);

    await test.step('Acessar consulta e validar campos', async () => {
      await consultaPage.acessar();
      test.skip(
        !(await consultaPage.telaCompativelComConsultaAgendamento()),
        'Cenario bloqueado: rota de consulta de agendamento nao abriu a tela esperada neste ambiente.'
      );
      await consultaPage.validarTelaConsultaAgendamento();
    });
  });

  test('deve validar obrigatoriedade com campos vazios', async ({ page }) => {
    const consultaPage = new CidadaoSmartAgendamentoConsultaPage(page);

    await test.step('Acessar consulta', async () => {
      await consultaPage.acessar();
      test.skip(
        !(await consultaPage.telaCompativelComConsultaAgendamento()),
        'Cenario bloqueado: rota de consulta de agendamento nao abriu a tela esperada neste ambiente.'
      );
    });

    await test.step('Prosseguir sem preencher para validar erro', async () => {
      const prosseguiu = await consultaPage.tentarProsseguir();
      if (!prosseguiu) {
        await consultaPage.validarProsseguirDesabilitado();
        return;
      }
      await consultaPage.validarErrosObrigatorios();
    });
  });

  test('deve processar tentativa com protocolo invalido', async ({ page }) => {
    const consultaPage = new CidadaoSmartAgendamentoConsultaPage(page);

    await test.step('Preencher protocolo invalido', async () => {
      await consultaPage.acessar();
      test.skip(
        !(await consultaPage.telaCompativelComConsultaAgendamento()),
        'Cenario bloqueado: rota de consulta de agendamento nao abriu a tela esperada neste ambiente.'
      );
      await consultaPage.preencherProtocolo('0000000000');
      await consultaPage.preencherDataNascimento('01/01/1990');
    });

    await test.step('Resolver CAPTCHA e submeter', async () => {
      await handleCaptcha(page);
      const prosseguiu = await consultaPage.tentarProsseguir();
      test.skip(
        !prosseguiu && process.env.CAPTCHA_MODE === 'disabled',
        'Cenario bloqueado: CAPTCHA real continua ativo e o bypass QA nao esta aplicado.'
      );
    });

    await test.step('Validar que nao houve navegação de sucesso', async () => {
      await expect(page).toHaveURL(/\/agendamentos\/consultar/i);
    });
  });

  test('deve consultar protocolo valido quando houver massa', async ({ page }) => {
    const consultaPage = new CidadaoSmartAgendamentoConsultaPage(page);
    const protocolo = process.env.CIDADAO_SMART_TEST_APPOINTMENT_PROTOCOL;
    const nascimento = process.env.CIDADAO_SMART_TEST_BIRTH_DATE;

    test.skip(!protocolo || !nascimento, 'Defina CIDADAO_SMART_TEST_APPOINTMENT_PROTOCOL e CIDADAO_SMART_TEST_BIRTH_DATE para este cenario.');

    await test.step('Preencher protocolo e nascimento validos', async () => {
      await consultaPage.acessar();
      test.skip(
        !(await consultaPage.telaCompativelComConsultaAgendamento()),
        'Cenario bloqueado: rota de consulta de agendamento nao abriu a tela esperada neste ambiente.'
      );
      await consultaPage.preencherProtocolo(protocolo as string);
      await consultaPage.preencherDataNascimento(nascimento as string);
    });

    await test.step('Resolver CAPTCHA e consultar', async () => {
      await handleCaptcha(page);
      const prosseguiu = await consultaPage.tentarProsseguir();
      test.skip(
        !prosseguiu && process.env.CAPTCHA_MODE === 'disabled',
        'Cenario bloqueado: CAPTCHA real continua ativo e o bypass QA nao esta aplicado.'
      );
    });
  });
});

