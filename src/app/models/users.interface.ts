import { LowerCasePipe } from '@angular/common';
import { datosPedidoInterface } from '@models/datosPedido.interface';
import { productInterface } from './products.interface';

export interface userInterface {
  _id?: string;
  apellidos?: string;
  contrasena?: string;
  direccion?: string;
  email?: string | LowerCasePipe;
  favoritos?: string[];
  img?: string;
  nombres?: string;
  numeroTelefono?: Number;
  pedido?: Array<productInterface>;
  pedidosRealizados?: [
    {
      _id?: string;
      pedido: Array<productInterface>;
      fecha: Date;
      entregado: Boolean;
      datosPedido: datosPedidoInterface;
    }
  ];
  userName?: string;
}
