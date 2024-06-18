import { Component } from '@angular/core';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-cards-banned',
  templateUrl: './cards-banned.component.html',
  styleUrl: './cards-banned.component.css'
})
export class CardsBannedComponent {

  pokemonCardsS: any[] = [];
  pokemonCardsE: any[] = [];
  pokemonCardsU: any[] = [];

  isLoading: boolean = true;  // Variable para el estado de carga

  delayLoader: boolean = true;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.searchCardsBannedStandard();
    this.searchCardsBannedExpanded();
    this.searchCardsBannedUnlimited();


  }

  searchCardsBannedStandard(): void {
    this.pokemonService.getStandardBanned().subscribe(data => {
      this.pokemonCardsS = data.data;


    });
  }
  searchCardsBannedExpanded(): void {
    this.pokemonService.getExpandedBanned().subscribe(data => {
      this.pokemonCardsE = data.data;

    });
  }
  searchCardsBannedUnlimited(): void {
    this.pokemonService.getUnlimitedBanned().subscribe(data => {
      this.pokemonCardsU = data.data;
      setTimeout(() => {
        this.isLoading = false;  // Cambia el estado de carga a false cuando se obtiene la información
      }, 150);
      this.delayLoader = false; // Cambio el estado del delay del loader

    });
  }



}
