import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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








}
