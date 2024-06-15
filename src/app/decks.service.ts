import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { PokemonCard } from './pokemon.service';

export interface DeckDTO {
  id: number;
  name: string;
  description: string;
  image?: any;
  creationDate: string; // Ajusta según el tipo de fecha que manejas en tu backend
  type: string;
  trainerId: number;
  deckCards: DeckCardDTO[];
}

export interface DeckCardDTO {
  id: number;
  cardid: string;
  quantity: number;
}

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

  createDeck(deckData: any, imageFile: File|null, userId: number, deckCardsJson: string): Observable<any> {
    const formData = new FormData();
    formData.append('deck', JSON.stringify(deckData));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    formData.append('userId', userId.toString());
    formData.append('deckCards', deckCardsJson);

    return this.http.post(`${this.baseUrl}/create`, formData);
  }

  getDecksByTrainer(trainerId: number): Observable<DeckDTO[]> {
    return this.http.get<DeckDTO[]>(`${this.baseUrl}/byTrainer/${trainerId}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener los mazos:', error);
          throw error; // Lanzar el error para que lo maneje el componente que llama a este método
        })
      );
  }





}
