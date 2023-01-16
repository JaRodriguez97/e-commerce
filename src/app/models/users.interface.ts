import { LowerCasePipe } from '@angular/common';
import { datosPedidoInterface } from '@models/datosPedido.interface';
import { disenoInterface } from '@models/diseno.interface';

export interface userInterface {
  _id?: string;
  apellidos?: string;
  contraseña?: string;
  direccion?: string;
  email?: string | LowerCasePipe;
  favoritos?: string[];
  img?: string;
  nombres?: string;
  pedido?: string[];
  pedidosRealizados?: [
    {
      pedido: string[];
      fecha: Date;
      entregado: Boolean;
      datosPedido: datosPedidoInterface;
    }
  ];
  numeroTelefono?: Number;
  userName?: string;
}
