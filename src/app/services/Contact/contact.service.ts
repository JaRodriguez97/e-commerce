import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  URL = environment.backend + 'sendEmail/';

  constructor(private http: HttpClient) {}

  headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  sendMesage(form: any): Observable<Object> {
    let headers = this.headers();

    return this.http.post(`${this.URL}contact`, form, { headers });
  }
}
