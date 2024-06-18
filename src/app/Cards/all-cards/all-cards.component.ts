import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-all-cards',
  templateUrl: './all-cards.component.html',
  styleUrl: './all-cards.component.css'
})
export class AllCardsComponent implements OnInit {


  isLoading: boolean = true;  // Variable para el estado de carga
  delayLoader: boolean = true; // Variable para el delay del loader

  pokemonSets: any[] = [];
  pokemonCards: any[] = [];
  pokemonTypes: any[] = [];
  pokemonSubtypes: any[] = [];
  pokemonSupertypes: any[] = [];
  pokemonRarities: any[] = [];
  searchTerm: string = '';
  filters: any = {};
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 0;

  constructor(private pokemonService: PokemonService) {}



  ngOnInit(): void {
    this.searchCards();
    this.loadFilters();
  }


  loadFilters(): void {
    this.pokemonService.getAllSets().subscribe(data => this.pokemonSets = data.data);
    this.pokemonService.getAllTypes().subscribe(data => this.pokemonTypes = data.data);
    this.pokemonService.getAllSubtypes().subscribe(data => this.pokemonSubtypes = data.data);
    this.pokemonService.getAllSupertypes().subscribe(data => this.pokemonSupertypes = data.data);
    this.pokemonService.getAllRarities().subscribe(data => this.pokemonRarities = data.data) ;

  }

  sanitizeFilter(value: string): string {
    return value.replace(/\s+/g, '*');
  }

  searchCards(): void {

    this.filters.set = this.sanitizeFilter(this.filters.set || '');
    this.filters.type = this.sanitizeFilter(this.filters.type || '');
    this.filters.subtype = this.sanitizeFilter(this.filters.subtype || '');
    this.filters.supertype = this.sanitizeFilter(this.filters.supertype || '');
    this.filters.rarity = this.sanitizeFilter(this.filters.rarity || '');
    this.filters.legalities = this.sanitizeFilter(this.filters.legalities || '');


    this.pokemonService.searchCards(this.filters, this.searchTerm, this.currentPage, this.pageSize).subscribe(data => {
      this.pokemonCards = data.data;
      this.totalPages = Math.ceil(data.totalCount / this.pageSize);
      setTimeout(() => {
        this.isLoading = false;  // Cambia el estado de carga a false cuando se obtiene la información
      }, 150);
      this.delayLoader = false; // Cambio el estado del delay del loader

    });
  }



  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.searchCards();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchCards();
    }
  }

}
