import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-expansion-detail',
  templateUrl: './expansion-detail.component.html',
  styleUrls: ['./expansion-detail.component.css']
})
export class ExpansionDetailComponent implements OnInit {

  set: any;
  isLoading: boolean = true;
  cardsByRarity: { [key: string]: any[] } = {};

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    const setId = this.route.snapshot.paramMap.get('id');
    this.pokemonService.getSetById(setId).subscribe(data => {
      this.set = data;
      this.loadCards(data.data.name);

    });
  }

  loadCards(setName: string): void {
    this.pokemonService.searchCardsBySetName(setName).subscribe(response => {
      this.organizeCardsByRarity(response.data);
      this.isLoading = false;
    });
  }

  organizeCardsByRarity(cards: any[]): void {
    this.cardsByRarity = cards.reduce((acc, card) => {
      const rarity = card.rarity || 'Unknown';
      if (!acc[rarity]) {
        acc[rarity] = [];
      }
      acc[rarity].push(card);
      return acc;
    }, {});
  }

  getRarities(): string[] {
    return Object.keys(this.cardsByRarity);
  }
}
