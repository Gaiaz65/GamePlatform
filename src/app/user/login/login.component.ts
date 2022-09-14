import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showAlert = false;
  alertMsg = ''
  alertColor=''

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,12}$/g),
  ]);

  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  constructor() {}

  ngOnInit(): void {}

  login() {
    this.showAlert = true;
    this.alertMsg = 'Wait a second! Precessing...';
    this.alertColor = 'blue';
  }
}
