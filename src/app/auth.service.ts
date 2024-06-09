import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth';

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    // Recupera el token del almacenamiento local
    const token = localStorage.getItem('token');

    // Verifica si token es null
    if (token !== null) {
      // Si token no es null, lo asignamos a currentUserSubject
      this.currentUserSubject = new BehaviorSubject<any>({ token });
    } else {
      // Si token es null, inicializamos currentUserSubject con un objeto vacío
      this.currentUserSubject = new BehaviorSubject<any>({});
    }

    // Convierte currentUserSubject en un observable
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  register(email: string, username: string, password: string, roles: string[]): Observable<any> {
    const roleRequest = { roleListName: roles };
    const registerRequest = { email, username, password, roleRequest };
    return this.http.post<any>(`${this.baseUrl}/register`, registerRequest).pipe(
      tap(response => console.log(response)),
      catchError(error => throwError(error))
    );
  }

  login(email: string, password: string): Observable<any> {
    const loginRequest = { email, password };
    return this.http.post<any>(`${this.baseUrl}/login`, loginRequest).pipe(
      map(response => {
        // Almacena el token en el localStorage para mantener la sesión

        localStorage.setItem('token', response.jwt);
        // Actualiza el currentUserSubject con el token recibido del backend
        this.currentUserSubject.next({ token: response.jwt });

        return response;
      }),
      catchError(error => throwError(error))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/Login']);
  }

  isAuthenticated(): boolean {
    // Verifica si el token del usuario está presente en el almacenamiento local
    return !!localStorage.getItem('token');
  }


}
