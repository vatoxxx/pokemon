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

    });
  }



}
