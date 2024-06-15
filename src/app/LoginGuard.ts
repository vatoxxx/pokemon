import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      // El usuario ya está autenticado, redirigir a otra ruta (por ejemplo, /Home)
      this.router.navigate(['/Home']);
      return false;
    }
    return true;
  }






}
