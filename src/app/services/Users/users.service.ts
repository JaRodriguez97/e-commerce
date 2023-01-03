import { Database } from 'src/database';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { userInterface } from '@models/users.interface';
import { Observable } from 'rxjs';
import { DocumentReference, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  URL = `${environment}api/user/`;

  constructor(private database: Database) {}

  headers(token: string | undefined) {
    // return new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   // Authorization: token,
    // });
  }

  getUser(id: String, token?: string): void {
    let headers = this.headers(token);

    // return this.http.post<userInterface>(`${this.URL}`, { id }, { headers });
  }

  getLogin(form: userInterface, token?: string): void {
    this.database
      .getDataDocument('usuarios', form.numeroTelefono)
      .then((res) => {
        console.log(
          '🚀 ~ file: users.service.ts:33 ~ UsersService ~ getLogin ~ res',
          res
        );
      });
  }

  getSignUp(
    form: userInterface,
    token?: string
  ): DocumentReference | userInterface | any {
    return this.database.createDataDocument(form, 'usuarios');
  }

  updateUser(
    id: String | null | undefined,
    dataUpdate: any,
    NamePropUpdate: String,
    token?: string
  ): void {
    let headers = this.headers(token);

    // return this.http.put<userInterface>(
    //   this.URL,
    //   { id, dataUpdate, NamePropUpdate },
    //   { headers }
    // );
  }
}
