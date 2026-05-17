import { consultaPedidoData } from '../consulta-pedido/consulta-pedido.data';
import { emissaoOnlineData } from '../emissao-online/emissao-online.data';

export const fluxoAssistidoViaExpressaData = {
  consulta: {
    protocoloInvalido: consultaPedidoData.protocoloInvalido,
    dataNascimento: consultaPedidoData.dataNascimento,
  },
  emissao: {
    cpfElegivel: emissaoOnlineData.cpfElegivel,
    fotoValida: emissaoOnlineData.fotoValida,
  },
};
