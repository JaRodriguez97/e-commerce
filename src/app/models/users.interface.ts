import { LowerCasePipe } from '@angular/common';
import { pedidoInterface } from './pedido.interface';

export interface userInterface {
  _id?: string;
  apellidos?: string;
  contraseña?: string;
  direccion?: string;
  email?: string | LowerCasePipe;
  favoritos?: string[];
  img?: string;
  nombres?: string;
  pedido?: pedidoInterface[];
  pedidosRealizados?: [{ pedido: pedidoInterface[]; fecha: Date }];
  numeroTelefono?: Number;
  userName?: string;
}
