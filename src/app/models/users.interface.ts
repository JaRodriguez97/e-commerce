import { LowerCasePipe } from '@angular/common';
import { datosPedidoInterface } from '@models/datosPedido.interface';

export interface userInterface {
  _id?: string;
  apellidos?: string;
  contraseña?: string;
  direccion?: string;
  email?: string | LowerCasePipe;
  favoritos?: string[];
  img?: string;
  nombres?: string;
  numeroTelefono?: Number;
  pedido?: string[];
  pedidosRealizados?: [
    {
      pedido: string[];
      fecha: Date;
      entregado: Boolean;
      datosPedido: datosPedidoInterface;
    }
  ];
  userName?: string;
}
