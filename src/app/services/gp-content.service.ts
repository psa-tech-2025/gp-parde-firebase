import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GpContentService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  /* -------------------- STORAGE -------------------- */

  uploadFile(folder: string, file: File) {
    const path = `gp/${folder}/${Date.now()}_${file.name}`;
    const ref = this.storage.ref(path);
    return this.storage.upload(path, file).then(() => ref.getDownloadURL());
  }

  /* -------------------- FIRESTORE CRUD -------------------- */

  // CREATE
  addItem(collection: string, data: any) {
    return this.firestore.collection(collection).add({
      ...data,
      createdAt: new Date()
    });
  }

  // READ
  getItems(collection: string) {
    return this.firestore.collection(collection, ref =>
      ref.orderBy('createdAt', 'desc')
    ).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => ({
          id: a.payload.doc.id,
          ...a.payload.doc.data() as any
        }))
      )
    );
  }

  // UPDATE
  updateItem(collection: string, id: string, data: any) {
    return this.firestore.collection(collection).doc(id).update(data);
  }

  // DELETE
  deleteItem(collection: string, id: string) {
    return this.firestore.collection(collection).doc(id).delete();
  }
  // 📤 Upload image
  async uploadImage(file: File) {
    const path = `gp/gallery/${Date.now()}_${file.name}`;
    const ref = this.storage.ref(path);
    await this.storage.upload(path, file);
    return ref.getDownloadURL().toPromise();
  }

  // ➕ Create
  addGallery(data: any) {
    return this.firestore.collection('gallery').add({
      ...data,
      createdAt: new Date()
    });
  }

  // 📥 Read (PUBLIC)
  getGallery() {
    return this.firestore.collection('gallery', ref =>
      ref.orderBy('createdAt', 'desc')
    ).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => ({
          id: a.payload.doc.id,
          ...a.payload.doc.data() as any
        }))
      )
    );
  }

  // ✏️ Update
  updateGallery(id: string, data: any) {
    return this.firestore.collection('gallery').doc(id).update(data);
  }

  // ❌ Delete
  deleteGallery(id: string) {
    return this.firestore.collection('gallery').doc(id).delete();
  }

  getOfficers() {
  return this.firestore.collection('officers', ref =>
    ref.orderBy('createdAt')
  ).snapshotChanges().pipe(
    map(actions =>
      actions.map(a => ({
        id: a.payload.doc.id,
        ...a.payload.doc.data() as any
      }))
    )
  );
}

addOfficer(data: any) {
  return this.firestore.collection('officers').add({
    ...data,
    createdAt: new Date()
  });
}

updateOfficer(id: string, data: any) {
  return this.firestore.collection('officers').doc(id).update(data);
}

deleteOfficer(id: string) {
  return this.firestore.collection('officers').doc(id).delete();
}
// gp-content.service.ts
getSchemes() {
  return this.firestore
    .collection('schemes', ref => ref.orderBy('createdAt', 'desc'))
    .valueChanges({ idField: 'id' });
}

addScheme(data: any) {
  return this.firestore.collection('schemes').add({
    ...data,
    createdAt: new Date()
  });
}

updateScheme(id: string, data: any) {
  return this.firestore.collection('schemes').doc(id).update(data);
}

deleteScheme(id: string) {
  return this.firestore.collection('schemes').doc(id).delete();
}
// gp-content.service.ts

getAbout() {
  return this.firestore.doc('about/main').valueChanges();
}

updateAbout(data: any) {
  return this.firestore.doc('about/main').set(data, { merge: true });
}
// gp-content.service.ts

getReports() {
  return this.firestore
    .collection('reports', ref => ref.orderBy('title'))
    .valueChanges({ idField: 'id' });
}

addReport(data: any) {
  return this.firestore.collection('reports').add(data);
}

updateReport(id: string, data: any) {
  return this.firestore.doc(`reports/${id}`).update(data);
}

deleteReport(id: string) {
  return this.firestore.doc(`reports/${id}`).delete();
}

// gp-content.service.ts

getCitizenInfo() {
  return this.firestore.doc('citizenInfo/main').valueChanges();
}

updateCitizenInfo(data: any) {
  return this.firestore.doc('citizenInfo/main')
    .set(data, { merge: true });
}
/* ================= HOME : NOTICE BOARD ================= */

getHomeNotices() {
  return this.firestore
    .collection('homeNotices', ref => ref.orderBy('createdAt', 'desc'))
    .snapshotChanges()
    .pipe(
      map(actions =>
        actions.map(a => ({
          id: a.payload.doc.id,
          ...a.payload.doc.data() as any
        }))
      )
    );
}

addHomeNotice(text: string) {
  return this.firestore.collection('homeNotices').add({
    text,
    createdAt: new Date()
  });
}

updateHomeNotice(id: string, text: string) {
  return this.firestore.collection('homeNotices').doc(id).update({ text });
}

deleteHomeNotice(id: string) {
  return this.firestore.collection('homeNotices').doc(id).delete();
}


/* ================= HOME : ANNOUNCEMENTS ================= */

getHomeAnnouncements() {
  return this.firestore
    .collection('homeAnnouncements', ref => ref.orderBy('createdAt', 'desc'))
    .snapshotChanges()
    .pipe(
      map(actions =>
        actions.map(a => ({
          id: a.payload.doc.id,
          ...a.payload.doc.data() as any
        }))
      )
    );
}

addHomeAnnouncement(text: string) {
  return this.firestore.collection('homeAnnouncements').add({
    text,
    createdAt: new Date()
  });
}

updateHomeAnnouncement(id: string, text: string) {
  return this.firestore.collection('homeAnnouncements').doc(id).update({ text });
}

deleteHomeAnnouncement(id: string) {
  return this.firestore.collection('homeAnnouncements').doc(id).delete();
}


/* ================= HOME : INTRO / OFFICERS ================= */

// READ – Public (Home page)
getHomeIntro() {
  return this.firestore
    .collection('homeIntro', ref => ref.orderBy('createdAt', 'desc'))
    .snapshotChanges()
    .pipe(
      map(actions =>
        actions.map(a => ({
          id: a.payload.doc.id,
          ...a.payload.doc.data() as any
        }))
      )
    );
}

// CREATE – Login only
addHomeIntro(data: any, uid: string) {
  return this.firestore.collection('homeIntro').add({
    ...data,
    createdBy: uid,
    createdAt: new Date()
  });
}

// UPDATE – Login only
updateHomeIntro(id: string, data: any) {
  return this.firestore.collection('homeIntro').doc(id).update({
    ...data,
    updatedAt: new Date()
  });
}

// DELETE – Login only
deleteHomeIntro(id: string) {
  return this.firestore.collection('homeIntro').doc(id).delete();
}

/* ================= HOME : GOOGLE MAP ================= */

// READ (Public & Admin)
getHomeMap() {
  return this.firestore
    .collection('homeMap', ref => ref.orderBy('createdAt', 'desc'))
    .snapshotChanges()
    .pipe(
      map(actions =>
        actions.map(a => ({
          id: a.payload.doc.id,
          ...a.payload.doc.data() as any
        }))
      )
    );
}

// CREATE (Login only)
addHomeMap(data: any) {
  return this.firestore.collection('homeMap').add({
    ...data,
    createdAt: new Date()
  });
}

// UPDATE (Login only)
updateHomeMap(id: string, data: any) {
  return this.firestore.collection('homeMap').doc(id).update({
    ...data,
    updatedAt: new Date()
  });
}

// DELETE (Login only)
deleteHomeMap(id: string) {
  return this.firestore.collection('homeMap').doc(id).delete();
}


/* ================= HOME : GEO INFO ================= */

// READ – Public & Admin
getGeoInfo() {
  return this.firestore
    .collection('geoInfo', ref => ref.orderBy('order'))
    .snapshotChanges()
    .pipe(
      map(actions =>
        actions.map(a => ({
          id: a.payload.doc.id,
          ...a.payload.doc.data() as any
        }))
      )
    );
}

// CREATE – Login only
addGeoInfo(data: any) {
  return this.firestore.collection('geoInfo').add({
    ...data,
    createdAt: new Date()
  });
}

// UPDATE – Login only
updateGeoInfo(id: string, data: any) {
  return this.firestore.collection('geoInfo').doc(id).update({
    ...data,
    updatedAt: new Date()
  });
}

// DELETE – Login only
deleteGeoInfo(id: string) {
  return this.firestore.collection('geoInfo').doc(id).delete();
}




}
