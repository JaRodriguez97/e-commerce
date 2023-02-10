import { LowerCasePipe } from '@angular/common';
import { pedidoRealizadoInterface } from '@models/pedidoRealizado.interface';
import { productInterface } from '@models/products.interface';

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
  pedidosRealizados?: Array<pedidoRealizadoInterface>;
  userName?: string;
}
