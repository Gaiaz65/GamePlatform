import { ModalService } from './../../services/modal.service';
import { Component, OnInit, Input, ElementRef } from '@angular/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() modalID = '';
  constructor(public modal: ModalService,
    public el: ElementRef) {}

  ngOnInit(): void {
    document.body.appendChild (this.el.nativeElement)
  }

  onCloseModal() {
    this.modal.toogleModal(this.modalID);
  };
}
