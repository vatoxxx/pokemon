import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../pokemon.service';

interface Weakness {
  type: string;
  value: string;
}

interface Resistance {
  type: string;
  value: string;
}

interface Attack {
  name: string;
  cost: string[];
  convertedEnergyCost: number;
  damage: string;
  text: string;
}

interface CardData {
  name: string;
  weaknesses?: Weakness[];
  resistances?: Resistance[];
  retreatCost?: string[];
  legalities?: {
    unlimited?: string;
    expanded?: string;
    standard?: string;
  };
  images: {
    small: string;
    large: string;
  };
  set: {
    name: string;
    releaseDate: string;
  };
  number: string;
  dexId: string;
  tcgplayer: {
    url: string;
  };
  cardmarket: {
    url: string;
  };
  supertype: string;
  subtypes?: string[];
  artist: string;
  hp: string;
  types?: string[];
  abilities?: {
    name: string;
    text: string;
  }[];
  rules?: string[];
  id: string;
  attacks?: Attack[];
}

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css']
})
export class CardDetailComponent implements OnInit {
  @Input() card!: { data: CardData };
  isLoading: boolean = true;  // Variable para el estado de carga

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) {}

  ngOnInit(): void {
    const cardId = this.route.snapshot.paramMap.get('id');
    this.pokemonService.getPokemonCardById(cardId).subscribe(
      data => {
        this.card = data;
        this.isLoading = false;  // Cambia el estado de carga a false cuando se obtiene la información
      },
      error => {
        this.isLoading = false;  // Asegúrate de manejar el error y cambiar el estado de carga
        console.error(error);
      }
    );
  }

  getWeaknesses(): string {
    return this.card.data.weaknesses ? this.card.data.weaknesses.map(w => `${w.type} ×${w.value}`).join(', ') : 'None';
  }

  getResistances(): string {
    return this.card.data.resistances ? this.card.data.resistances.map(r => `${r.type} -${r.value}`).join(', ') : 'None';
  }

  getRetreatCost(): string {
    return this.card.data.retreatCost ? this.card.data.retreatCost.length.toString() : 'None';
  }
}
