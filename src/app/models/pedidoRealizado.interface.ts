import { datosPedidoInterface } from '@models/datosPedido.interface';
import { productInterface } from '@models/products.interface';

export interface pedidoRealizadoInterface {
  _id?: string;
  pedido: Array<productInterface>;
  fecha: Date;
  entregado?: {
    aceptado?: { fecha: Date; operador: string };
    procesado?: { fecha: Date; operador: string };
    enviado?: { fecha: Date; operador: string };
    finalizado?: { fecha: Date; operador: string };
  };
  datosPedido: datosPedidoInterface;
}
