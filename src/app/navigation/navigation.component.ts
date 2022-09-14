import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './../services/auth.service';
import { ModalService } from './../services/modal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  constructor(public modal: ModalService, public authService: AuthService, private afAuth: AngularFireAuth) {}

  ngOnInit(): void {}

  openModal($event: Event) {
    $event.preventDefault();
    this.modal.toogleModal('auth');
  }

 async logout(event:Event) {
    event.preventDefault();
    await this.afAuth.signOut()
  }
}
