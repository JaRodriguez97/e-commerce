import { LowerCasePipe } from '@angular/common';
import { ValidationErrors } from '@angular/forms';
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
  pedidosRealizados?: [
    {
      pedido: disenoInterface[];
      fecha: Date;
      entregado: Boolean;
      datosPedido: {
        nombre: (String | ValidationErrors | null)[];
        apellido: (String | ValidationErrors | null)[];
        email: (String | LowerCasePipe | ValidationErrors | null)[];
        fechaHora: (String | ValidationErrors | null)[];
        celular: (Number | ValidationErrors | null)[];
        direccion: (String | ValidationErrors | null)[];
        detallesUbicacion: (String | ValidationErrors | null)[];
        detallesPedido: (String | ValidationErrors | null)[];
      };
    }
  ];
  numeroTelefono?: Number;
  userName?: string;
}
