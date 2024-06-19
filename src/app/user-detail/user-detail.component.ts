import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainerService } from '../trainer.service';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  username: string | null = '';
  trainerDetails: any;
   mazos: any[] = []; // Inicializa como array

   currentPage: number = 1;
   itemsPerPage: number = 9;
   paginatedDecks: any[] = [];
   totalPages: number = 0;

  constructor(private route: ActivatedRoute, private trainerService: TrainerService,private pokemonservice:PokemonService) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username'); // Obtener el username de la ruta

    if (this.username) {
      this.trainerService.getUserDetails(this.username)
        .subscribe(
          (data) => {
            this.trainerDetails = {
              username: data.username,
              image: data.image ? `data:image/jpeg;base64,${data.image}` : 'default-image-url',
              biografia: data.biografia,
              numberOfDecks: data.numberOfDecks,
              numberOfComments: data.numberOfComments // Nuevo campo para comentarios
            };
          },
          (error) => {
            console.error('Error al cargar los detalles del entrenador:', error);
          }
        );

      this.trainerService.getDecksByTrainerUsername(this.username)
        .subscribe(
          (data) => {
            this.mazos = data.map(deck => ({
              id: deck.id,
              name: deck.name,
              description: deck.description,
              creationDate: deck.creationDate,
              type: deck.type,
              trainerId: deck.trainerId,
              image: deck.image ? `data:image/jpeg;base64,${deck.image}` : 'default-image-url',
              deckcards: deck.deckCards,
              price: 0
            }));

            this.mazos.forEach(mazo => {
              this.trainerService.getTrainerByUserIddeck(mazo.trainerId)
                .subscribe(trainer => {
                  mazo.trainer = {
                    username: trainer.username,
                    image: trainer.image ? `data:image/jpeg;base64,${trainer.image}` : 'default-image-url'
                  };
                  this.updatePaginatedDecks(); // Actualizar decks después de obtener la información del entrenador
                });
            });

            this.calculateDeckPrices();

          },
          (error) => {
            console.error('Error al cargar los mazos del entrenador:', error);
          }
        );
    }
  }


  calculateDeckPrices(): void {
    this.mazos.forEach(mazo => {
      let totalPrice = 0;
      let cardRequests = mazo.deckcards.map((card: { cardid: string | null; quantity: number; }) =>
        this.pokemonservice.getPokemonCardById(card.cardid).toPromise()
          .then(response => {
            const cardPrice = response.data.cardmarket.prices.averageSellPrice;
            totalPrice += cardPrice * card.quantity;
          })
      );
      Promise.all(cardRequests).then(() => {
        mazo.price = totalPrice.toFixed(2);
        this.updatePaginatedDecks();
      }).catch(error => {
        console.error('Error al obtener los precios de las cartas:', error);
      });
    });
  }

  updatePaginatedDecks(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDecks = this.mazos.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.mazos.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedDecks();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedDecks();
    }
  }
}
