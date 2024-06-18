import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  email: string = '';
  forgotEmail: string = '';
  roles: string[] = ['USER']; // Default role, you can add more roles as needed
  error: string = '';
  container!: HTMLDivElement;
  overlayBackground!: HTMLDivElement;
  forgotPasswordForm!: HTMLDivElement;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Ensure elements exist before adding event listeners
    const signUpButton = document.getElementById('signUp') as HTMLButtonElement;
    const signInButton = document.getElementById('signIn') as HTMLButtonElement;
    this.container = document.getElementById('containerl') as HTMLDivElement;
    this.overlayBackground = document.getElementById('overlayBackground') as HTMLDivElement;
    this.forgotPasswordForm = document.getElementById('forgotPasswordForm') as HTMLDivElement;

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
    this.authService.register(this.email, this.username, this.password, this.roles).subscribe({
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
    this.authService.login(this.email, this.password).subscribe({
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
    this.forgotPasswordForm.style.display = 'flex';
  }

  closeForgotPassword() {
    this.overlayBackground.style.display = 'none';
    this.forgotPasswordForm.style.display = 'none';
  }

  openSignUp() {
    this.closeForgotPassword();
    this.container.classList.add('right-panel-active');
  }

  sendForgotPasswordEmail() {
    this.authService.sendPasswordResetEmail(this.forgotEmail).subscribe({
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
