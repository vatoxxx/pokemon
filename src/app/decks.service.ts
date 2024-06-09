import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DecksService {

  private baseUrl = 'http://localhost:8081/api/decks';


  constructor(private http: HttpClient, private router: Router) { }


  veralldecks(): Observable<any> {

    return this.http.get<any>(`${this.baseUrl}/all`).pipe(tap(response => console.log(response)),catchError(error=>{
      return throwError(error);
    }));
  }
}
