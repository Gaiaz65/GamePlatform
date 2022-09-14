import { ModalService } from './../../services/modal.service';
import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalID = '';
  constructor(public modal: ModalService,
    public el: ElementRef) {}

  ngOnInit(): void {
    document.body.appendChild (this.el.nativeElement)
  }

  ngOnDestroy(): void {
      document.body.removeChild(this.el.nativeElement)
  }

  onCloseModal() {
    this.modal.toogleModal(this.modalID);
  };
}
