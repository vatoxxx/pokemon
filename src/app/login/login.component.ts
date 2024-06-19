import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  error: string = '';
  container!: HTMLDivElement;
  overlayBackground!: HTMLDivElement;
  forgotPasswordFormElement!: HTMLDivElement;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(12)]]
    });

    this.loginForm = this.fb.group({
      emailOrUsername: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.maxLength(12)]]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const signUpButton = document.getElementById('signUp') as HTMLButtonElement;
    const signInButton = document.getElementById('signIn') as HTMLButtonElement;
    this.container = document.getElementById('containerl') as HTMLDivElement;
    this.overlayBackground = document.getElementById('overlayBackground') as HTMLDivElement;
    this.forgotPasswordFormElement = document.getElementById('forgotPasswordForm') as HTMLDivElement;

    if (signUpButton && signInButton && this.container) {
      signUpButton.addEventListener('click', () => {
        this.container.classList.add('right-panel-active');
      });

      signInButton.addEventListener('click', () => {
        this.container.classList.remove('right-panel-active');
      });
    } else {
      console.error('One or more elements were not found in the DOM.');
    }
  }

  register() {
    if (this.registerForm.invalid) {
      this.error = 'Please correct the errors in the form.';
      return;
    }

    const { email, username, password } = this.registerForm.value;
    this.authService.register(email, username, password, ['USER']).subscribe({
      next: () => {
        this.router.navigate(['/Login']);
        if (this.container) {
          this.container.classList.remove('right-panel-active');
        } else {
          console.error('Container element not found.');
        }
      },
      error: err => {
        this.error = 'Registration failed';
        console.error('Registration error: ', err);
      }
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.error = 'Please correct the errors in the form.';
      return;
    }

    const { emailOrUsername, password } = this.loginForm.value;
    this.authService.login(emailOrUsername, password).subscribe({
      next: response => {
        this.router.navigate(['/']);
      },
      error: err => {
        this.error = 'Login failed';
        console.error('Login error: ', err);
      }
    });
  }

  openForgotPassword() {
    this.overlayBackground.style.display = 'block';
    this.forgotPasswordFormElement.style.display = 'flex';
  }

  closeForgotPassword() {
    this.overlayBackground.style.display = 'none';
    this.forgotPasswordFormElement.style.display = 'none';
  }

  openSignUp() {
    this.closeForgotPassword();
    this.container.classList.add('right-panel-active');
  }

  sendForgotPasswordEmail() {
    if (this.forgotPasswordForm.invalid) {
      this.error = 'Please enter a valid email.';
      return;
    }

    const { email } = this.forgotPasswordForm.value;
    this.authService.sendPasswordResetEmail(email).subscribe({
      next: () => {
        alert('Password reset email sent successfully.');
        this.closeForgotPassword();
      },
      error: err => {
        if (err.status === 404) {
          alert('User not found.');
        } else {
          alert('An error occurred while sending the password reset email.');
        }
      }
    });
  }
}
