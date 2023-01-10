import { LowerCasePipe } from '@angular/common';
import { disenoInterface } from './diseno.interface';

export interface userInterface {
  _id?: string;
  apellidos?: string;
  contraseña?: string;
  direccion?: string;
  email?: string | LowerCasePipe;
  favoritos?: string[];
  img?: string;
  nombres?: string;
  pedido?: disenoInterface[];
  pedidosRealizados?: [{ pedido: disenoInterface[]; fecha: Date }];
  numeroTelefono?: Number;
  userName?: string;
}
