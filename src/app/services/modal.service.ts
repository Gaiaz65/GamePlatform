import { Injectable } from '@angular/core';

interface IModal {
  id:string;
  visible:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor() { }
  private modals:IModal[] = [];



  register(id:string) {
    this.modals.push({
      id,
      visible:false
    })
  }
  unregister (id:string) {
    this.modals = this.modals.filter (
      el => el.id !==id
    )

  }

  isModalOpen(id:string):boolean {
    return !!this.modals.find(el => el.id === id)?.visible

  }
  toogleModal(id :string) {
    const modal = this.modals.find(el => el.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
  }
}
