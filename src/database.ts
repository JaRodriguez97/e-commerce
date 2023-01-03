import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  QuerySnapshot,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { userInterface } from '@app/models/users.interface';

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

  async getDataCollection(coleccion: string): Promise<DocumentData[]> {
    let docRef = collection(this.db, coleccion);
    const docSnap = await getDocs(docRef);

    return docSnap.docs.map((diseño) => {
      let docReturn: userInterface = diseño.data();

      docReturn._id = diseño.id;

      return docReturn;
    });
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
