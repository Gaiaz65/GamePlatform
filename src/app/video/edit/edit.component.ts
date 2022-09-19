import { ClipService } from './../../services/clip.service';

import { ModalService } from './../../services/modal.service';
import { Component, OnInit, OnDestroy, Input, EventEmitter } from '@angular/core';
import IClip from 'src/app/model/clip.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { OnChanges } from '@angular/core';
import { Output } from '@angular/core';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  constructor(private modal: ModalService,
    private clipService: ClipService) {}

  @Input() activeClip: IClip | null = null
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Updating the clip'
  inSubmission = false;

  @Output() update = new EventEmitter()

  clipID = new FormControl('');

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
  });
  editFormular = new FormGroup({
    title: this.title,
    id: this.clipID,
  });

  ngOnInit(): void {
    this.modal.register('editClip');
  }
  ngOnDestroy() {
    this.modal.unregister('editClip');
  }
  ngOnChanges() {
    if (!this.activeClip) {
      return;
    }
    this.inSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }

  async submit() {
    if(!this.activeClip){
      return
    }
      this.showAlert = true;
      this.inSubmission = true;
      this.alertColor = 'blue';
      this.alertMsg = 'Updating the clip';

      try{
        await this.clipService.updateClip(this.clipID.value, this.title.value)
      } catch(err) {
        this.inSubmission = false
        this.alertColor = 'red'
        this.alertMsg = 'Something went wrong, try again later'
           return
      }
      this.activeClip.title = this.title.value
      this.update.emit(this.activeClip)

         this.inSubmission = false
         this.alertColor = 'green'
         this.alertMsg = 'The clip has been updated'
  }
}
