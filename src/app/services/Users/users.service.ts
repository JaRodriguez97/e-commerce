import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { userInterface } from '@models/users.interface';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { Database } from 'src/database';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private database: Database) {}

  async getUser(id: string, token?: string): Promise<userInterface> {
    return await this.database.getDataDocument('usuarios', id);
  }

  async getLogin(form: userInterface, token?: string): Promise<userInterface> {
    let userFound = await this.database.getDataDocument(
      'usuarios',
      form.numeroTelefono
    );

    return atob(userFound['contraseña']!) == form.contraseña
      ? userFound
      : Promise.reject(
          'la contraseña no coincide, por favor ingrésala nuevamente'
        );
  }

  async getSignUp(
    form: userInterface,
    token?: string
  ): Promise<undefined | userInterface> {
    let existUser = this.database.getDataDocument(
      'usuarios',
      form.numeroTelefono
    );

    if (!(await existUser))
      return this.database.createDataDocument(form, 'usuarios');

    console.error(existUser);
    throw Error(
      `Este número de celular ya se encuentra registrado en la base de datos,
         por favor intente con otro número.`
    );
  }

  async updateUser(
    id: string,
    dataUpdate: any,
    coleccion: string,
    token?: string
  ) {
    return this.database.updateDocument(id, dataUpdate, coleccion);
  }
}
