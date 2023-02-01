import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { userInterface } from '@models/users.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  URL = environment.backend;

  constructor(private http: HttpClient) {}

  headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  getUser(id: string, token?: string): Observable<userInterface> {
    let headers = this.headers();

    return this.http.get(`${this.URL}/${id}`, { headers });
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

  updateUser(id: string, dataUpdate: any, propiedad: string, token?: string) {
    let headers = this.headers(),
      form = { id, dataUpdate, propiedad };

    return this.http.post(`${this.URL}login`, form, { headers });
  }
}
