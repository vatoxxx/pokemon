import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './api';

export interface PokemonCard {
  id: string;

  cardid:string;

  name: string|undefined;
  supertype:string;
  quantity:number;
  images: {
    small: string;
    large: string;
  };
}

export interface PokemonSet {
  id: string;
  name: string;
}

export interface FilterOptions {
  set: string;
  type: string;
  subtype: string;
  supertype: string;
  rarity: string;
  legalities: string;
}

export interface CardSearchResponse {
  data: PokemonCard[];
  totalCount: number;
}


@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private apiUrlfilters = 'https://api.pokemontcg.io/v2';
  private apiUrl = 'https://api.pokemontcg.io/v2/cards';
  private apiUrlnueva = 'https://api.pokemontcg.io/v2/cards?q=set.releaseDate:2024*&pageSize=20';
  private apiUrlSets = 'https://api.pokemontcg.io/v2/sets';
/*  private apiUrlnueva = 'https://api.pokemontcg.io/v2/sets?q=releaseDate:*&orderBy=-releaseDate&pageSize=5'; */



  private apiKey =  environment.pokemonTcgApiKey// Inserta tu API key aquí

  constructor(private http: HttpClient) { }

  getPokemonCards(): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey
    });
    return this.http.get(`${this.apiUrlnueva}`, { headers });
  }


  getPokemonCardById(id: string|null): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey
    });

    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }



  getSetsOrderedByReleaseDate(page: number, pageSize: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey
    });

    let params = new HttpParams()
      .set('orderBy', '-releaseDate')
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(this.apiUrlSets, { headers, params });
  }


  getSetById(id: string|null): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey
    });

    return this.http.get<any>(`${this.apiUrlSets}/${id}`, { headers });
  }






 // Obtener todos los sets
 getAllSets(): Observable<any> {
  const headers = new HttpHeaders({
    'X-Api-Key': this.apiKey
  });

  return this.http.get<any>(`${this.apiUrlfilters}/sets`, { headers });
}

// Obtener todos los tipos
getAllTypes(): Observable<any> {
  const headers = new HttpHeaders({
    'X-Api-Key': this.apiKey
  });

  return this.http.get<any>(`${this.apiUrlfilters}/types`, { headers });
}



// Obtener todos los subtipos
getAllSubtypes(): Observable<any> {
  const headers = new HttpHeaders({
    'X-Api-Key': this.apiKey
  });

  return this.http.get<any>(`${this.apiUrlfilters}/subtypes`, { headers });
}

// Obtener todos los supertipos
getAllSupertypes(): Observable<any> {
  const headers = new HttpHeaders({
    'X-Api-Key': this.apiKey
  });

  return this.http.get<any>(`${this.apiUrlfilters}/supertypes`, { headers });
}

// Obtener todas las rarezas
getAllRarities(): Observable<any> {
  const headers = new HttpHeaders({
    'X-Api-Key': this.apiKey
  });

  return this.http.get<any>(`${this.apiUrlfilters}/rarities`, { headers });
}

// Buscar cartas con filtros
searchCards(filters: any|null, searchTerm: string, page: number, pageSize: number): Observable<any> {
  const headers = new HttpHeaders({
    'X-Api-Key': this.apiKey
  });

  let query = '';
  if (searchTerm) {
    query += `name:${searchTerm}* `;
  }
  if (filters.set) {
    query += `set.id:${filters.set} `;
  }
  if (filters.type) {
    query += `types:${filters.type} `;
  }
  if (filters.subtype) {
    query += `subtypes:${filters.subtype} `;
  }
  if (filters.supertype) {
    query += `supertype:${filters.supertype} `;
  }
  if (filters.rarity) {
    query += `rarity:${filters.rarity} `;
  }
  if (filters.legalities) {
    query += `legalities.${filters.legalities}:legal `;
  }

  const offset = (page - 1) * pageSize;
  return this.http.get<any>(`${this.apiUrl}?q=${query.trim()}&page=${page}&pageSize=${pageSize}&orderBy=name,releaseDate`, { headers });
}


getStandardBanned(): Observable<any> {
  const headers = new HttpHeaders({
    'X-Api-Key': this.apiKey
  });

  return this.http.get<any>(`${this.apiUrl}?q=legalities.standard:banned`, { headers });
}

getExpandedBanned(): Observable<any> {
  const headers = new HttpHeaders({
    'X-Api-Key': this.apiKey
  });

  return this.http.get<any>(`${this.apiUrl}?q=legalities.expanded:banned`, { headers });
}

getUnlimitedBanned(): Observable<any> {
  const headers = new HttpHeaders({
    'X-Api-Key': this.apiKey
  });

  return this.http.get<any>(`${this.apiUrl}?q=legalities.unlimited:banned`, { headers });
}





}
