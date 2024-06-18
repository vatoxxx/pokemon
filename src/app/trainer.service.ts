import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TrainersDTO {
  username: string;
  image: string;
  biografia: string;
  numberOfDecks: number;
}

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private baseUrl = 'http://localhost:8081/api/trainers';

  constructor(private http: HttpClient) {}

  getTrainerByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${userId}`);
  }

  updateProfile(formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, formData);
  }

  getTrainerByUserIddeck(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/deck/${userId}`);
  }

  getUserDetails(username: string | null): Observable<TrainersDTO> {
    return this.http.get<TrainersDTO>(`${this.baseUrl}/user/detail/${username}`);
  }






}
