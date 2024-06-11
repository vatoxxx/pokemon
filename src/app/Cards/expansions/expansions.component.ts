import { Component } from '@angular/core';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-expansions',
  templateUrl: './expansions.component.html',
  styleUrl: './expansions.component.css'
})
export class ExpansionsComponent {

  pokemonSets: any[] = [];
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadSets();
  }

  loadSets(): void {
    this.pokemonService.getSetsOrderedByReleaseDate(this.currentPage, this.pageSize).subscribe(data => {
      this.pokemonSets = data.data;
      this.totalPages = Math.ceil(data.totalCount / this.pageSize); // Calcula el número total de páginas
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadSets();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadSets();
    }
  }


}
