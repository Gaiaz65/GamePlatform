import { AuthService } from './../services/auth.service';
import { ModalService } from './../services/modal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  isAuth = false
  constructor(public modal: ModalService,
    private authService:AuthService) {
      this.authService.isAuth$.subscribe( status => {
        this.isAuth = status
      })
    }

  ngOnInit(): void {}

  openModal($event : Event) {
    $event.preventDefault();
    this.modal.toogleModal('auth')
  }
}
