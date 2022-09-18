import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  isDragover = false
  file: File | null = null
  loadingVideo = false

  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Processing the uploading'
  inSubmission = false
  progress = 0

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
  });
  upluadFrom = new FormGroup({
    title: this.title,
  });

  constructor(
    private storage: AngularFireStorage) {}

  ngOnInit(): void {}

  storeFile(event: Event) {
    this.isDragover = false;
    this.file = (event as DragEvent).dataTransfer?.files.item(0) ?? null;
    console.log(this.file);

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.loadingVideo = true;
  }

  uploadFile() {
      this.showAlert = true;
      this.alertColor = 'blue';
      this.alertMsg = 'Processing the uploading';
      this.inSubmission = true;


    const clipFileName = uuid()
    console.log(clipFileName);
    const clipPath = `clips/${clipFileName}.mp4`;
    const task = this.storage.upload(clipPath, this.file)
    task.percentageChanges().subscribe( progress => {
      this.progress = progress as number / 100
    })
  }
}
