import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';

// Http Conections
import { ApiService } from '@services/api.service';
import { SessionStorageService } from '@services/session-storage.service';
import * as CryptoJS from 'crypto-js';

function emailValidator(): ValidatorFn {
  // return Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
  return (control: AbstractControl) => {
    const email = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(
      control.value
    );
    if (email) return null;
    return { emailValidator: true };
  };
}

function passwordValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const hasUpperCase = /[A-Z]/.test(control.value);
    const hasNumber = /[0-9]/.test(control.value);
    if (hasNumber && hasUpperCase) return null;
    return { passwordValidator: true };
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  #fb = inject(FormBuilder);
  #api = inject(ApiService);
  #session = inject(SessionStorageService);
  #router = inject(Router);

  loginForm = this.#fb.group({
    email: ['', [Validators.required, emailValidator()]],
    password: ['', [Validators.required, passwordValidator()]],
  });

  handlingData(
    data: Partial<{ email: string | null; password: string | null }>
  ): { email: string; password: string } {
    const utf8Bytes = CryptoJS.enc.Utf8.parse(data.password!);
    const hashedPassword = CryptoJS.SHA256(utf8Bytes).toString(
      CryptoJS.enc.Hex
    );
    return {
      email: data.email!,
      password: hashedPassword,
    };
  }

  redirectToHome(): void {
    this.#router.navigate(['/home']);
  }

  submit() {
    console.log(this.loginForm);
    if (this.loginForm.valid) {
      const data = this.handlingData(this.loginForm.value);
      this.#api.httpPost$('checkLogin', data).subscribe({
        next: (next) => {
          console.log(next);
          try {
            this.#session.setItem('token', next.user_token);
            this.redirectToHome();
          } catch (e) {
            console.log(e);
          }
        },
        error: (error) => console.log(error),
      });
    }
  }
}
