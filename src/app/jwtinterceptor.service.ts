import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const ALLOWED_URLS = [
  'http://localhost:8081/api/decks/create',
  'http://localhost:8081/api/decks/byTrainer/',
  'http://localhost:8081/api/decks/',
  'http://localhost:8081/api/comments/deck/',
  'http://localhost:8081/api/comments/add',
  'http://localhost:8081/api/trainers/update',
  'http://localhost:8081/api/decks/'

];

const ALLOWED_METHODS = ['GET','POST', 'PUT', 'DELETE'];

@Injectable()
export class JwtInterceptor implements HttpInterceptor {




    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const isAllowedUrl = ALLOWED_URLS.some(url => request.url.includes(url));
      const isAllowedMethod = ALLOWED_METHODS.includes(request.method);

        let currentUser = this.authService.currentUserValue;
        if (currentUser && currentUser.token && (isAllowedUrl && isAllowedMethod)) { // Asegúrate de usar 'token' en lugar de 'jwt'
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }
        console.log(request);
        return next.handle(request);
    }
}

