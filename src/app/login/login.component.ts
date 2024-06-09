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
  roles: string[] = ['USER']; // Default role, you can add more roles as needed
  error: string = '';
  container!: HTMLDivElement ;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Ensure elements exist before adding event listeners
    const signUpButton = document.getElementById('signUp') as HTMLButtonElement;
    const signInButton = document.getElementById('signIn') as HTMLButtonElement;
    this.container = document.getElementById('containerl') as HTMLDivElement;

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
    this.authService.register(this.email,this.username, this.password, this.roles).subscribe({
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
}
