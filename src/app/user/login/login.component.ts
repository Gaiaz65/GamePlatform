import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showAlert = false
  inSubmission = false
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

  constructor(
    private auth: AngularFireAuth
  ) {}

  ngOnInit(): void {}

  async login() {
    this.showAlert = true
    this.alertMsg = 'Wait a second! Precessing...'
    this.alertColor = 'blue'
    this.inSubmission = true


    try {
     await this.auth.signInWithEmailAndPassword(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
      this.showAlert = false;
    } catch (err) {

      this.alertMsg = 'An error occured! Try again later...';
      this.inSubmission = false;
      this.alertColor = 'red';

      return
    }
    this.alertMsg = 'You are in!';
    this.inSubmission = false;
    this.alertColor = 'green';
  }
}
