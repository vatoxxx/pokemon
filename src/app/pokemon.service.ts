import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './api';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private apiUrl = 'https://api.pokemontcg.io/v2/cards';
  private apiUrlnueva = 'https://api.pokemontcg.io/v2/cards?q=set.releaseDate:2024*&pageSize=20';
/*  private apiUrlnueva = 'https://api.pokemontcg.io/v2/sets?q=releaseDate:*&orderBy=-releaseDate&pageSize=5'; */



  private apiKey =  environment.pokemonTcgApiKey// Inserta tu API key aquí

  constructor(private http: HttpClient) { }

  getPokemonCards(): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey
    });
    return this.http.get(`${this.apiUrlnueva}`, { headers });
  }

  async getPokemonCardById(id: string): Promise<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey
    });

    try {
      const response = await this.http.get(`${this.apiUrl}/${id}`, { headers }).toPromise();
      return response;
    } catch (error) {
      console.error('Error al obtener la carta:', error);
      throw error; // Puedes manejar el error de otra manera si lo deseas
    }
  }





  searchCardsByName(name: string): Observable<any> {
    const params = new HttpParams().set('q', `name:${name}`);
    return this.http.get<any>(this.apiUrl, { params });
  }

  searchCardsWithFilters(filters: any): Observable<any> {
    // Implementa la lógica para aplicar los filtros a la solicitud HTTP
    // Puedes consultar la documentación de pokemontcg.io para saber cómo aplicar filtros específicos
    return this.http.get<any>(this.apiUrl, { params: filters });
  }
}

