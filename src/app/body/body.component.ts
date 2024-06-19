import { Component } from '@angular/core';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

  slides = [
    {
      image: 'assets/wallpaper1.jpg',
      captionTitle: 'Bienvenido a PokePlanner',
      captionText: 'Descubre nuestra base de datos de cartas y expansiones de Pokémon'
    },
    {
      image: 'assets/wallpaper4.png',
      captionTitle: 'Explora Nuestro Catálogo de Mazos',
      captionText: 'Encuentra y crea los mejores mazos'
    },
    {
      image: 'assets/paradoxrift.jpg',
      captionTitle: 'Construye y Comparte',
      captionText: 'Crea y comparte tus mazos con la comunidad'
    }
  ];

  pokemonCards: any[] = []; // Inicializamos la propiedad como un arreglo vacío

  selectedCard: any;


  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.getPokemonCards();
    this.getPokemonCardById('xy1-1');
  }

  getPokemonCards(): void {
    this.pokemonService.getPokemonCards()
      .subscribe((data: any) => {
        this.pokemonCards = data.data;
      });
  }

   getPokemonCardById(id:string):void {
    this.pokemonService.getPokemonCardById(id)
    .subscribe((data: any) => {
      this.selectedCard = data;
    });

  }


}
