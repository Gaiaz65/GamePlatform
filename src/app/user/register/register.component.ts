import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private emailTaken: EmailTaken) {}

  showAlert = false;
  alertMsg = 'Wait a second! Precessing...';
  alertColor = 'grey';
  loading = false;

  name = new FormControl('', [Validators.required, Validators.minLength(6)]);
  email = new FormControl('', [Validators.required, Validators.email], [this.emailTaken.validate]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,12}$/g),
  ]);
  age = new FormControl(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(100),
  ]);
  confirm_password = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.minLength(15),
    Validators.maxLength(15),
  ]);

  registerForm = new FormGroup(
    {
      name: this.name,
      email: this.email,
      age: this.age,
      password: this.password,
      confirm_password: this.confirm_password,
      phoneNumber: this.phoneNumber,
    },
    [RegisterValidators.match('password', 'confirm_password')]
  );

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Wait a second! Precessing...';
    this.alertColor = 'grey';
    this.loading = true;

    try {
      await this.authService.createUser(this.registerForm.value);
    } catch (e) {
      console.error(e);
      this.alertMsg = 'Unexpected error';
      this.alertColor = 'red';
      this.loading = false;
      return;
    }
    this.alertMsg = 'your account has been created!';
    this.alertColor = 'green';
    this.loading = false;
  }
}
