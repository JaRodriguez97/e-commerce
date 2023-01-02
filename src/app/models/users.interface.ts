import { LowerCasePipe } from '@angular/common';
import { pedidoInterface } from './pedido.interface';

export interface userInterface {
  _id?: string;
  apellidos?: String;
  contraseña?: String;
  direccion?: String;
  email?: String | LowerCasePipe;
  favoritos?: String[];
  img?: String;
  nombres?: String;
  pedido?: pedidoInterface[];
  pedidosRealizados?: [{ pedido: pedidoInterface[]; fecha: Date }];
  numeroTelefono?: Number;
  userName?: String;
}
