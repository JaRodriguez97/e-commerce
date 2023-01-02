import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
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
  query,
  where,
} from 'firebase/firestore';
import { userInterface } from './models/users.interface';

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
    const q = query(
        collection(this.db, coleccion),
        where('numeroTelefono', '==', id)
      ),
      querySnapshot = await getDocs(q);

    querySnapshot.forEach((snap) => {
      console.log(
        '🚀 ~ file: database.ts:47 ~ Database ~ querySnapshot.forEach ~ snap',
        snap.data()
      );
    });

    // return querySnapshot[0].data();
  }

  async createDataDocument(
    form: userInterface,
    coleccion: string
  ): Promise<DocumentData | undefined> {
    let collectionRef = collection(this.db, coleccion),
      documentData = await addDoc(collectionRef, form),
      documentSnapshot = await getDoc(documentData);

    console.info('Usuario creado: ', documentData.id);

    return documentSnapshot.data();
  }

  // async getDataCollection(
  //   coleccion: string,
  //   id: string
  // ): Promise<DocumentData | undefined> {
  //   let docRef = collection(this.db, coleccion);
  //   const docSnap = await getDoc(docRef);

  //   return docSnap.data();
  // }
}
