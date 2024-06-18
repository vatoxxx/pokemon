import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteCardService {

  private baseUrl = 'http://localhost:8081/api/favorite-cards';





  constructor(private http: HttpClient) {}


  addfavoritecard(userId: number,cardid:string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/add`);
  }
}
