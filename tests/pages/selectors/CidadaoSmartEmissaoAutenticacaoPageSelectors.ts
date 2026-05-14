export const CidadaoSmartEmissaoAutenticacaoPageSelectors = {
  route: /\/emitir\/nao-sei-meu-cpf/,
  titulo: /autenticacao|autenticação/i,
  textoAjuda: /digite seus dados pessoais/i,
  campoNomeCompleto: /nome completo/i,
  campoDataNascimento: /data de nascimento/i,
  campoNomeMaeCompleto: /nome da mae completo|nome da mãe completo/i,
  captchaTexto: /nao sou um robo|não sou um robô/i,
  botaoVoltar: /voltar/i,
  botaoProsseguir: /prosseguir|continuar/i,
  erroObrigatorio: /obrigatorio|obrigatório|campo requerido|campo obrigatorio/i,
};
