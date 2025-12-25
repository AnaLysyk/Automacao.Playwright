export function gerarUsuario() {
  const timestamp = Date.now();
  const sufixo = Math.floor(Math.random() * 1000);
  const nome = `Ana Lysyk ${timestamp}`;

  return {
    nome,
    email: `ana.lysyk${timestamp}${sufixo}@exemplo.com`,
    senha: `SenhaAna!${timestamp}`,
    diaNascimento: String((timestamp % 27) + 1),
    mesNascimento: String((timestamp % 12) + 1),
    anoNascimento: String(1980 + (timestamp % 20)),
    primeiroNome: 'Ana',
    ultimoNome: `Lysyk${sufixo}`,
    empresa: 'Empresa Lysyk',
    endereco: 'Rua Lysyk 123',
    endereco2: 'Complemento 456',
    pais: 'Canada',
    estado: 'Estado',
    cidade: 'Cidade',
    cep: '12345-678',
    celular: '5511999999999',
  };
}

export function gerarProdutoPesquisa() {
  const opcoes = ['dress', 'jeans', 'shirt', 'top'];
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}
