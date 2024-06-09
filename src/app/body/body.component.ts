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
      image: 'assets/temporalforces.jpg',
      captionTitle: 'Bienvenido a Nuestra Página',
      captionText: 'Descubre nuestros productos y servicios'
    },
    {
      image: 'assets/paldeanfates.jpg',
      captionTitle: 'Explora Nuestro Catálogo',
      captionText: 'Encuentra lo que buscas'
    },
    {
      image: 'assets/paradoxrift.jpg',
      captionTitle: 'Ofertas Exclusivas',
      captionText: 'Aprovecha nuestras promociones'
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

  async getPokemonCardById(id:string): Promise<void> {
    try {
       this.selectedCard = await this.pokemonService.getPokemonCardById(id);
      console.log('Carta obtenida:', this.selectedCard);
      console.log(this.selectedCard.data.name)
    } catch (error) {
      console.error('Error al obtener la carta:', error);
    }
  }


}
