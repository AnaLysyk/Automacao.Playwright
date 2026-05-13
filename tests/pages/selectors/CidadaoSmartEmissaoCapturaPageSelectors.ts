export const CidadaoSmartEmissaoCapturaPageSelectors = {
  route: /\/emitir\/captura/,
  titulo: /foto para o documento/i,
  recomendacoes: [
    /escolha um ambiente bem iluminado/i,
    /evite o uso de acessorios|evite o uso de acessórios/i,
    /procure um fundo adequado/i,
    /centralize seu rosto/i,
  ],
  botaoEnviarNovaFoto: /enviar nova foto/i,
  botaoUsarCamera: /usar camera|usar câmera/i,
  botaoVoltar: /voltar/i,
  botaoProsseguir: /prosseguir/i,
  modalAjustarFoto: /ajustar foto/i,
  botaoAceitar: /aceitar/i,
  sucessoFotoCapturada: /foto capturada com sucesso|sua nova foto/i,
};
