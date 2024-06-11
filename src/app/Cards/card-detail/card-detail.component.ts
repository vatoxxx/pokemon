import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css'
})
export class CardDetailComponent {

  card: any;

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    const cardId = this.route.snapshot.paramMap.get('id');
    this.pokemonService.getPokemonCardById(cardId).subscribe(data => {
      this.card = data;
    });
  }

}
