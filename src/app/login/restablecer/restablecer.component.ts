import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.component.html',
  styleUrl: './restablecer.component.css'
})
export class RestablecerComponent {

  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  error: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = "Passwords do not match";
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        alert('Password reset successfully.');
        this.router.navigate(['/login']);
      },
      error: err => {
        if (err.status === 404) {
          alert('User not found.');
        } else {
          alert('An error occurred while resetting the password.');
        }
      }
    });
  }

}
