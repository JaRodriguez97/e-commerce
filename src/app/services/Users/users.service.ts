import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { pedidoRealizadoInterface } from '@models/pedidoRealizado.interface';
import { userInterface } from '@models/users.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  URL = environment.backend + 'usuarios/';

  constructor(private http: HttpClient) {}

  headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  getUsers(token?: string): Observable<userInterface> {
    let headers = this.headers();

    return this.http.get(this.URL, { headers });
  }

  getUser(id: string, token?: string): Observable<userInterface> {
    let headers = this.headers();

    return this.http.get(`${this.URL}${id}`, { headers });
  }

  getSeguimientoPedido(id: string, token?: string) {
    let headers = this.headers();

    return this.http.get<Array<pedidoRealizadoInterface>>(
      `${this.URL}seguimientoPedido/${id}`,
      { headers }
    );
  }

  getLogin(form: userInterface, token?: string): Observable<userInterface> {
    let headers = this.headers();

    return this.http.post(`${this.URL}login`, form, { headers });
  }

  getSignUp(form: userInterface, token?: string) {
    let headers = this.headers();

    return this.http.post<userInterface>(`${this.URL}signUp`, form, {
      headers,
    });
  }

  updateUser(id: string, dataUpdate: any, propiedad?: string, token?: string) {
    let headers = this.headers(),
      form = { id, dataUpdate, propiedad };

    return this.http.post<userInterface>(`${this.URL}updateUser`, form, {
      headers,
    });
  }

  sendOrder(id: string, dataUpdate: any, propiedad?: string, token?: string) {
    let headers = this.headers(),
      form = { id, dataUpdate, propiedad };

    return this.http.post<userInterface>(`${this.URL}sendOrder`, form, {
      headers,
    });
  }
}
