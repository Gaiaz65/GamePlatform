import { ClipService } from './../../services/clip.service';

import { Component, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnDestroy {
  isDragover = false;
  file: File | null = null;
  user: firebase.User | null = null;
  loadingVideo = false;
  showPercentage = false;

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Processing the uploading';
  inSubmission = false;
  progress = 0;
  task?: AngularFireUploadTask

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
  });
  uploadFormular = new FormGroup({
    title: this.title,
  });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService
  ) {
    auth.user.subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
  this.task?.cancel()
  }

  storeFile(event: Event) {
    this.isDragover = false;
    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files.item(0) ?? null
      : (event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.loadingVideo = true;
  }

  uploadFile() {
    this.uploadFormular.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Processing the uploading';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    this.task.percentageChanges().subscribe((progress) => {
      this.progress = (progress as number) / 100;
    });

    this.task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: (url) => {
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `clips/${clipFileName}.mp4`,
            url,
          };

          this.clipService.createClip(clip);

          this.alertColor = 'green';
          this.alertMsg = 'The video has been uploaded';
          this.showPercentage = false;
        },
        error: (error) => {
          this.uploadFormular.enable();

          this.alertColor = 'red';
          this.alertMsg = 'Something went wrong, try again later';
          this.showPercentage = false;
          this.inSubmission = true;
          console.error(error);
        },
      });
  }
}
