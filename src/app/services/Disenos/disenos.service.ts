import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { disenoInterface } from '@models/diseno.interface';

@Injectable({
  providedIn: 'root',
})
export class DisenosService {
  URL = environment.backend;

  constructor(private http: HttpClient) {}

  headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  getDisenos() {
    let headers = this.headers();
    return this.http.get<disenoInterface[]>(`${this.URL}disenos`, { headers });
  }

  getDiseno(id: string) {
    let headers = this.headers();
    return this.http.get(`${this.URL}${id}`, { headers });
  }

  // getCombo(_id: String, token?: string): Observable<comboInterface> {
  //   let headers = this.headers(token);

  //   return this.http.get<comboInterface>(this.URL + _id, { headers });
  // }

  getTotalPedido(arrayID: String[], token?: string) {
    let headers = this.headers();
    return this.http.post(this.URL, { arrayID }, { headers });
  }

  // updateComboComentario(id: String, contactForm: any, token?: string) {
  //   let headers = this.headers(token);

  //   return this.http.put<comboInterface>(
  //     this.URL + 'createComent',
  //     { id, contactForm },
  //     { headers }
  //   );
  // }
}
