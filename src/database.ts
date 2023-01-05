import { disenoInterface } from '@models/diseno.interface';
import { Injectable } from '@angular/core';
import { userInterface } from '@app/models/users.interface';
import { environment } from '@env/environment';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class Database {
  db!: Firestore;

  constructor() {
    let firebaseOptions = { projectId: environment.projectId },
      app = initializeApp(firebaseOptions);

    this.db = getFirestore(app);

    console.log('Database is Connect!');
  }

  async getDataCollection(coleccion: string): Promise<disenoInterface[]> {
    let q = query(collection(this.db, coleccion));

    return await getDocs(q).then((docSnap) =>
      docSnap.docs.map((doc) => {
        let docReturn: disenoInterface = { ...doc.data(), _id: doc.id };
        return docReturn;
      })
    );
  }

  async getDataDocument(
    coleccion: string,
    id: string | number | Number | undefined
  ) {
    let q = query(
        collection(this.db, coleccion),
        where('numeroTelefono', '==', id)
      ),
      querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      let docReturn: userInterface = doc.data();

      docReturn._id = doc.id;

      return docReturn;
    })[0];
  }

  async createDataDocument(
    form: userInterface,
    coleccion: string
  ): Promise<DocumentData> {
    let collectionRef = collection(this.db, coleccion),
      documentData = await addDoc(collectionRef, form),
      documentSnapshot = await getDoc(documentData);

    console.warn('Usuario creado: ', documentData.id);

    return documentSnapshot.data()!;
  }

  async updateDocument(id: string, dataUpdate: any, coleccion: string) {
    let refDocument = doc(this.db, coleccion, id);

    await updateDoc(refDocument, dataUpdate).then((res) => {
      console.log(
        '🚀 ~ file: database.ts:79 ~ Database ~ awaitupdateDoc ~ res',
        res
      );
    });
  }
}
