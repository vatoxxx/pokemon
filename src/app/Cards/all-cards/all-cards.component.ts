import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-all-cards',
  templateUrl: './all-cards.component.html',
  styleUrl: './all-cards.component.css'
})
export class AllCardsComponent implements OnInit {
  searchTerm: string = '';
  filters: any = {}; // Aquí almacenarás los filtros seleccionados

  constructor(private cardService: PokemonService) {}

  ngOnInit(): void {}

  searchCards() {
    if (Object.keys(this.filters).length === 0) {
      // Si no hay filtros, buscar por nombre
      this.cardService.searchCardsByName(this.searchTerm).subscribe(cards => {
        // Procesa las cartas obtenidas
        console.log(cards);
      });
    } else {
      // Si hay filtros, aplicarlos y buscar
      this.cardService.searchCardsWithFilters(this.filters).subscribe(cards => {
        // Procesa las cartas obtenidas
        console.log(cards);
      });
    }
  }
}
