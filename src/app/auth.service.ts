import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, interval, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelper } from './JwtHelper';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private tokenCheckSubscription: Subscription | undefined;

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    this.currentUserSubject = new BehaviorSubject<any>(token ? { token } : null);
    this.currentUser = this.currentUserSubject.asObservable();

    if (token) {
      this.startTokenExpirationCheck();
      this.decodeAndSetCurrentUser(token);
    }

  }


  decodeAndSetCurrentUser(token: string) {
    try {
      const decodedToken: any = jwtDecode(token);
      this.currentUserSubject.next({ ...decodedToken, token });
      return decodedToken;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  updateCurrentUser(user: any) {
    this.currentUserSubject.next(user);
    this.saveUserToLocalStorage(user);
    this.startTokenExpirationCheck();
  }

  saveUserToLocalStorage(user: any) {
    if (user && user.token) {
      localStorage.setItem('token', user.token);
    } else {
      localStorage.removeItem('token');
    }
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
        localStorage.setItem('token', response.jwt);
        this.currentUserSubject.next({ token: response.jwt });
        this.startTokenExpirationCheck();
        return response;
      }),
      catchError(error => throwError(error))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.stopTokenExpirationCheck();
    this.router.navigate(['/Login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !JwtHelper.isTokenExpired(token);
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  private startTokenExpirationCheck() {
    this.stopTokenExpirationCheck();
    this.tokenCheckSubscription = interval(1000 * 60).subscribe(() => {  // Check every minute
      const token = this.getToken();
      if (JwtHelper.isTokenExpired(token)) {
        this.logout();
      }
    });
  }

  private stopTokenExpirationCheck() {
    if (this.tokenCheckSubscription) {
      this.tokenCheckSubscription.unsubscribe();
      this.tokenCheckSubscription = undefined;
    }
  }


  sendPasswordResetEmail(email: string): Observable<any> {
    const url = `${this.baseUrl}/password-reset`;
    return this.http.post(url, { email: email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    const url = `${this.baseUrl}/password-reset/confirm`;
    return this.http.post(url, { token: token, newPassword: newPassword });
  }




}
