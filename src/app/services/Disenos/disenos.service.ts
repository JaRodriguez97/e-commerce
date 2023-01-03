import { Injectable } from '@angular/core';
import { diseñoInterface } from '@models/diseno.interface';
import { DocumentData } from 'firebase/firestore';
import { Database } from 'src/database';

@Injectable({
  providedIn: 'root',
})
export class DiseñosService {
  constructor(private database: Database) {}

  getDiseños(): Promise<diseñoInterface[] | DocumentData[]> {
    return this.database.getDataCollection('diseños');
  }

  // }
  // getCombo(_id: String, token?: string): Observable<comboInterface> {
  //   let headers = this.headers(token);

  //   return this.http.get<comboInterface>(this.URL + _id, { headers });
  // }

  // getTotalPedido(
  //   arrayID: String[],
  //   token?: string
  // ): Observable<comboInterface[]> {
  //   let headers = this.headers(token);

  //   return this.http.post<comboInterface[]>(this.URL, { arrayID }, { headers });
  // }

  // updateComboComentario(id: String, contactForm: any, token?: string) {
  //   let headers = this.headers(token);

  //   return this.http.put<comboInterface>(
  //     this.URL + 'createComent',
  //     { id, contactForm },
  //     { headers }
  //   );
  // }
}
