import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { PokemonCard } from './pokemon.service';
import { AuthService } from './auth.service';

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

export interface CommentRequestDTO {
  content: string;
  deckId: number;
  trainerId: number;
  likes: number;
  dislikes: number;
}

export interface CommentResponseDTO {
  id: number;
  content: string;
  creationDateTime: number[];
  deckId: number;
  trainerId: number;
  likes: number;
  dislikes: number;
  trainer?: {
    username: string;
    image: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DecksService {

  private baseUrl = 'http://localhost:8081/api/decks';
  private commentsUrl = 'http://localhost:8081/api/comments';


  constructor(private http: HttpClient, private router: Router,private authService: AuthService) { }


  veralldecks(): Observable<DeckDTO[]> {

    return this.http.get<DeckDTO[]>(`${this.baseUrl}/all`).pipe(tap(response => console.log(response)),catchError(error=>{
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


  getCardsbydeck(deckid: number|null): Observable<DeckCardDTO[]> {
    return this.http.get<DeckCardDTO[]>(`${this.baseUrl}/${deckid}/cards`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener los mazos:', error);
          throw error; // Lanzar el error para que lo maneje el componente que llama a este método
        })
      );
  }



  getDeckbyid(deckid: number|null): Observable<DeckDTO> {
    return this.http.get<DeckDTO>(`${this.baseUrl}/${deckid}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener los mazos:', error);
          throw error; // Lanzar el error para que lo maneje el componente que llama a este método
        })
      );
  }

  getDecksByType(type: string|null): Observable<DeckDTO[]> {
    return this.http.get<DeckDTO[]>(`${this.baseUrl}/type/${type}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener los mazos:', error);
          throw error; // Lanzar el error para que lo maneje el componente que llama a este método
        })
      );
  }


  getcommentsbydeckid(deckid: number|null): Observable<any> {
    return this.http.get<any>(`${this.commentsUrl}/deck/${deckid}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener los mazos:', error);
          throw error; // Lanzar el error para que lo maneje el componente que llama a este método
        })
      );
  }

  addComment(comment: CommentRequestDTO): Observable<CommentResponseDTO> {
    return this.http.post<CommentResponseDTO>(`${this.commentsUrl}/add`, comment);
  }

  deleteDeck(deckId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${deckId}`);
  }




}
