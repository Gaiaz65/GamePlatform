
import { ModalService } from './../../services/modal.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import IClip from 'src/app/model/clip.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { OnChanges } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  constructor(private modal: ModalService) {}

  @Input() activeClip: IClip | null = null;

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
  ngOnChanges(){
    if(!this.activeClip){
      return
    }
    this.clipID.setValue(this.activeClip.docID)
    this.title.setValue(this.activeClip.title)
  }
}
