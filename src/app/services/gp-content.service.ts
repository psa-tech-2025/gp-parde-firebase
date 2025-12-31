import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GpContentService {

  // 🔑 ROOT FOLDER (ONLY CHANGE POINT)
  private readonly ROOT = 'sendi';
// store old images during edit
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  /* ==================== STORAGE ==================== */

  uploadFile(folder: string, file: File) {
    const path = `${this.ROOT}/${folder}/${Date.now()}_${file.name}`;
    const ref = this.storage.ref(path);
    return this.storage.upload(path, file).then(() => ref.getDownloadURL());
  }

  async uploadImage(file: File) {
    const path = `${this.ROOT}/gallery/${Date.now()}_${file.name}`;
    const ref = this.storage.ref(path);
    await this.storage.upload(path, file);
    return ref.getDownloadURL().toPromise();
  }

  /* ==================== COMMON CRUD ==================== */

  addItem(collection: string, data: any) {
    return this.firestore
      .collection(`${this.ROOT}/${collection}/items`)
      .add({ ...data, createdAt: new Date() });
  }

  getItems(collection: string) {
    return this.firestore
      .collection(`${this.ROOT}/${collection}/items`, ref =>
        ref.orderBy('createdAt', 'desc')
      )
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

  updateItem(collection: string, id: string, data: any) {
    return this.firestore
      .doc(`${this.ROOT}/${collection}/items/${id}`)
      .update(data);
  }

  deleteItem(collection: string, id: string) {
    return this.firestore
      .doc(`${this.ROOT}/${collection}/items/${id}`)
      .delete();
  }

  /* ==================== GALLERY ==================== */

  addGallery(data: any) {
    return this.firestore
      .collection(`${this.ROOT}/gallery/items`)
      .add({ ...data, createdAt: new Date() });
  }

  getGallery() {
    return this.firestore
      .collection(`${this.ROOT}/gallery/items`, ref =>
        ref.orderBy('createdAt', 'desc')
      )
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

  updateGallery(id: string, data: any) {
    return this.firestore
      .doc(`${this.ROOT}/gallery/items/${id}`)
      .update(data);
  }

  deleteGallery(id: string) {
    return this.firestore
      .doc(`${this.ROOT}/gallery/items/${id}`)
      .delete();
  }

  /* ==================== OFFICERS ==================== */

  getOfficers() {
    return this.firestore
      .collection(`${this.ROOT}/officers/items`, ref =>
        ref.orderBy('createdAt')
      )
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

  addOfficer(data: any) {
    return this.firestore
      .collection(`${this.ROOT}/officers/items`)
      .add({ ...data, createdAt: new Date() });
  }

  updateOfficer(id: string, data: any) {
    return this.firestore
      .doc(`${this.ROOT}/officers/items/${id}`)
      .update(data);
  }

  deleteOfficer(id: string) {
    return this.firestore
      .doc(`${this.ROOT}/officers/items/${id}`)
      .delete();
  }

  /* ==================== SCHEMES ==================== */

  getSchemes() {
    return this.firestore
      .collection(`${this.ROOT}/schemes/items`, ref =>
        ref.orderBy('createdAt', 'desc')
      )
      .valueChanges({ idField: 'id' });
  }

  addScheme(data: any) {
    return this.firestore
      .collection(`${this.ROOT}/schemes/items`)
      .add({ ...data, createdAt: new Date() });
  }

  updateScheme(id: string, data: any) {
    return this.firestore
      .doc(`${this.ROOT}/schemes/items/${id}`)
      .update(data);
  }

  deleteScheme(id: string) {
    return this.firestore
      .doc(`${this.ROOT}/schemes/items/${id}`)
      .delete();
  }

  /* ==================== ABOUT ==================== */

  getAbout() {
    return this.firestore
      .doc(`${this.ROOT}/about/main`)
      .valueChanges();
  }

  updateAbout(data: any) {
    return this.firestore
      .doc(`${this.ROOT}/about/main`)
      .set(data, { merge: true });
  }

  /* ==================== REPORTS ==================== */

  getReports() {
    return this.firestore
      .collection(`${this.ROOT}/reports/items`, ref =>
        ref.orderBy('title')
      )
      .valueChanges({ idField: 'id' });
  }

  addReport(data: any) {
    return this.firestore
      .collection(`${this.ROOT}/reports/items`)
      .add(data);
  }

  updateReport(id: string, data: any) {
    return this.firestore
      .doc(`${this.ROOT}/reports/items/${id}`)
      .update(data);
  }

  deleteReport(id: string) {
    return this.firestore
      .doc(`${this.ROOT}/reports/items/${id}`)
      .delete();
  }

  /* ==================== CITIZEN INFO ==================== */

  getCitizenInfo() {
    return this.firestore
      .doc(`${this.ROOT}/citizenInfo/main`)
      .valueChanges();
  }

  updateCitizenInfo(data: any) {
    return this.firestore
      .doc(`${this.ROOT}/citizenInfo/main`)
      .set(data, { merge: true });
  }

  /* ==================== HOME : NOTICES ==================== */

  getHomeNotices() {
    return this.firestore
      .collection(`${this.ROOT}/homeNotices/items`, ref =>
        ref.orderBy('createdAt', 'desc')
      )
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
    return this.firestore
      .collection(`${this.ROOT}/homeNotices/items`)
      .add({ text, createdAt: new Date() });
  }

  updateHomeNotice(id: string, text: string) {
    return this.firestore
      .doc(`${this.ROOT}/homeNotices/items/${id}`)
      .update({ text });
  }

  deleteHomeNotice(id: string) {
    return this.firestore
      .doc(`${this.ROOT}/homeNotices/items/${id}`)
      .delete();
  }

  /* ==================== HOME : ANNOUNCEMENTS ==================== */

  getHomeAnnouncements() {
    return this.firestore
      .collection(`${this.ROOT}/homeAnnouncements/items`, ref =>
        ref.orderBy('createdAt', 'desc')
      )
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
    return this.firestore
      .collection(`${this.ROOT}/homeAnnouncements/items`)
      .add({ text, createdAt: new Date() });
  }

  updateHomeAnnouncement(id: string, text: string) {
    return this.firestore
      .doc(`${this.ROOT}/homeAnnouncements/items/${id}`)
      .update({ text });
  }

  deleteHomeAnnouncement(id: string) {
    return this.firestore
      .doc(`${this.ROOT}/homeAnnouncements/items/${id}`)
      .delete();
  }

  /* ==================== HOME : INTRO ==================== */

  getHomeIntro() {
    return this.firestore
      .collection(`${this.ROOT}/homeIntro/items`, ref =>
        ref.orderBy('createdAt', 'desc')
      )
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

  addHomeIntro(data: any, uid: string) {
    return this.firestore
      .collection(`${this.ROOT}/homeIntro/items`)
      .add({ ...data, createdBy: uid, createdAt: new Date() });
  }

  updateHomeIntro(id: string, data: any) {
    return this.firestore
      .doc(`${this.ROOT}/homeIntro/items/${id}`)
      .update({ ...data, updatedAt: new Date() });
  }

  deleteHomeIntro(id: string) {
    return this.firestore
      .doc(`${this.ROOT}/homeIntro/items/${id}`)
      .delete();
  }

  /* ==================== HOME : MAP ==================== */

  getHomeMap() {
    return this.firestore
      .collection(`${this.ROOT}/homeMap/items`, ref =>
        ref.orderBy('createdAt', 'desc')
      )
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

  addHomeMap(data: any) {
    return this.firestore
      .collection(`${this.ROOT}/homeMap/items`)
      .add({ ...data, createdAt: new Date() });
  }

  updateHomeMap(id: string, data: any) {
    return this.firestore
      .doc(`${this.ROOT}/homeMap/items/${id}`)
      .update({ ...data, updatedAt: new Date() });
  }

  deleteHomeMap(id: string) {
    return this.firestore
      .doc(`${this.ROOT}/homeMap/items/${id}`)
      .delete();
  }

  /* ==================== GEO INFO ==================== */

  getGeoInfo() {
    return this.firestore
      .collection(`${this.ROOT}/geoInfo/items`, ref =>
        ref.orderBy('order')
      )
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

  addGeoInfo(data: any) {
    return this.firestore
      .collection(`${this.ROOT}/geoInfo/items`)
      .add({ ...data, createdAt: new Date() });
  }

  updateGeoInfo(id: string, data: any) {
    return this.firestore
      .doc(`${this.ROOT}/geoInfo/items/${id}`)
      .update({ ...data, updatedAt: new Date() });
  }

  deleteGeoInfo(id: string) {
    return this.firestore
      .doc(`${this.ROOT}/geoInfo/items/${id}`)
      .delete();
  }
}
