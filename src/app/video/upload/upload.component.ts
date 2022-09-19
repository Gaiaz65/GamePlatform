import { FfmpegService } from './../../services/ffmpeg.service';
import { Router } from '@angular/router';
import { ClipService } from './../../services/clip.service';

import { Component, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import {  switchMap, combineLatest } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { forkJoin } from 'rxjs';


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
  screenshots:string[]=[]
  selectedScreenshot=''
  screenshotTask?: AngularFireUploadTask

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
  });
  uploadFormular = new FormGroup({
    title: this.title,
  });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router,
    public ffmpegService:FfmpegService
  ) {
    auth.user.subscribe((user) => (this.user = user))
    this.ffmpegService.init()
  }

  ngOnDestroy(): void {
  this.task?.cancel()
  }

  async storeFile(event: Event) {
    if(this.ffmpegService.isRunning){
      return
    }

    this.isDragover = false;
    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files.item(0) ?? null
      : (event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file)

    this.selectedScreenshot = this.screenshots[0]

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.loadingVideo = true;
  }

  async uploadFile() {
    this.uploadFormular.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Processing the uploading';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    )




    const screenshotPath = `screenshots/${clipFileName}.png`

    this.screenshotTask=this.storage.upload(screenshotPath, screenshotBlob);
    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    const screenshotRef = this.storage.ref(screenshotPath)


    combineLatest([this.task.percentageChanges(), this.screenshotTask.percentageChanges()]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress

      if (!screenshotProgress || !screenshotProgress) {
        return
      }

      const total = screenshotProgress + screenshotProgress;
        this.progress = total as number / 200;
    });

    forkJoin([this.task.snapshotChanges(),
    this.screenshotTask.snapshotChanges() ])
      .pipe(
        switchMap(() => forkJoin([
          clipRef.getDownloadURL(),
        screenshotRef.getDownloadURL()]))
      )
      .subscribe({
        next: async (urls) => {
          const [clipURL, screenshotURL] = urls

          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `clips/${clipFileName}.mp4`,
            url: clipURL,
            screenshotURL,
            screenshotFileName:`${clipFileName}.png`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };

          const clipDocRef =  await this.clipService.createClip(clip);

          this.alertColor = 'green';
          this.alertMsg = 'The video has been uploaded';
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate([
              'clip',clipDocRef.id
            ])
          }, 1000);
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
