import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-expansion-detail',
  templateUrl: './expansion-detail.component.html',
  styleUrl: './expansion-detail.component.css'
})
export class ExpansionDetailComponent {

  set: any;

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    const setId = this.route.snapshot.paramMap.get('id');
    this.pokemonService.getSetById(setId).subscribe(data => {
      this.set = data;
    });
  }

}
