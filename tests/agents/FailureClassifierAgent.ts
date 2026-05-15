export type FailureCategory =
  | 'produto'
  | 'automacao'
  | 'ambiente'
  | 'massa'
  | 'captcha'
  | 'email'
  | 'agenda-indisponivel'
  | 'known-issue'
  | 'permissao'
  | 'configuracao-booking';

export class FailureClassifierAgent {
  classify(error: unknown): FailureCategory {
    const message = error instanceof Error ? error.message : String(error || '');

    if (/strict mode|selector|locator|not found|nao encontrado|não encontrado/i.test(message)) {
      return 'automacao';
    }

    if (/expired.*captcha|captcha.*expired|EXPIRED_CAPTCHA|captcha|recaptcha|robo|robô/i.test(message)) {
      return 'captcha';
    }

    if (/codigo|código|email|e-mail|seguranca|segurança/i.test(message)) {
      return 'email';
    }

    if (/sem vaga|nenhuma vaga|nenhuma data|nenhum horario|nenhum horário|agenda indisponivel|agenda indisponível/i.test(message)) {
      return 'agenda-indisponivel';
    }

    if (/aeroporto|top tower/i.test(message)) {
      return 'known-issue';
    }

    if (/401|403|forbidden|unauthorized|permiss/i.test(message)) {
      return 'permissao';
    }

    if (/booking|posto|service point|configuracao|configuração|404/i.test(message)) {
      return 'configuracao-booking';
    }

    if (/ECONN|connect|network|ERR_NETWORK|offline|EACCES|inacess/i.test(message)) {
      return 'ambiente';
    }

    if (/timeout|timed out/i.test(message)) {
      return 'automacao';
    }

    if (/massa|dados|cpf|data de nascimento/i.test(message)) {
      return 'massa';
    }

    return 'produto';
  }
}

