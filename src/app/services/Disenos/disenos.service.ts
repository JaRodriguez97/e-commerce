import { Injectable } from '@angular/core';
import { disenoInterface } from '@models/diseno.interface';
import { DocumentData } from 'firebase/firestore';
import { Database } from 'src/database';

@Injectable({
  providedIn: 'root',
})
export class DisenosService {
  constructor(private database: Database) {}

  async getDisenos(): Promise<disenoInterface[] | DocumentData[]> {
    return await this.database.getDataCollection('disenos');
  }

  async getDiseno(id: string): Promise<disenoInterface | DocumentData> {
    return await this.database.getDataDocument('disenos', id);
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
