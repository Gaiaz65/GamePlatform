import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map } from 'rxjs/operators';
import { of, switchMap, BehaviorSubject, lastValueFrom } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import IClip from '../model/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCollection!: AngularFirestoreCollection<IClip>;
  pageClips:IClip[] = []
  pending = false

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage) {
    this.clipsCollection = db.collection('clips');
  }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data);
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([
      this.auth.user,
    sort$]).pipe(
      switchMap((values) => {
        const [user, sort$] = values
        if (!user) {
          return of([]);
        }

        const query = this.clipsCollection.ref.where('uid', '==', user.uid).orderBy(
          'timestamp',
          sort$ === '1' ? 'asc' : 'desc'
        )

        return query.get();
      }),
      map((snapshot) => (snapshot as QuerySnapshot<IClip>).docs)
    );
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title
    });
  }

  async deleteClip(clip:IClip){
    const clipRef = this.storage.ref(`${clip.fileName}`)
    const screenshotRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`)


    await clipRef.delete()
    await screenshotRef.delete();

    await this.clipsCollection.doc(clip.docID).delete();
  }

  async getClips() {

    if (this.pending){
      return
    }

    this.pending = true
      let query = this.clipsCollection.ref
        .orderBy('timestamp', 'desc')
        .limit(9);

    const { length } = this.pageClips

    if (length) {
      const lastDocID = this.pageClips[length-1].docID
      const lastDoc = await lastValueFrom(
        this.clipsCollection.doc(lastDocID).get()
      )
      query = query.startAfter(lastDoc)
    }
    const snapshot = await query.get()

    snapshot.forEach(doc => {
      this.pageClips.push({
        docID: doc.id,
        ...doc.data()
      })
    })

    this.pending = false;
  }
}
