import { Component } from '@angular/core';
import { DecksService } from '../../decks.service';
import { PokemonService } from '../../pokemon.service';
import { AuthService } from '../../auth.service';
import { TrainerService } from '../../trainer.service';

@Component({
  selector: 'app-all-decks',
  templateUrl: './all-decks.component.html',
  styleUrl: './all-decks.component.css'
})
export class AllDecksComponent {

  mazos: any[] = []; // Inicializa como array
  userid:number=0;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  paginatedDecks: any[] = [];
  totalPages: number = 0;
  isAuthenticated: boolean = false; // Variable para verificar si el usuario está logeado

  isLoading: boolean = true;  // Variable para el estado de carga
  delayLoader: boolean = true; // Variable para el delay del loader


  constructor(private decks:DecksService,private pokemonservice:PokemonService,private authService:AuthService,private trainerService: TrainerService){}

  ngOnInit(): void {
    this.getdecks();
    this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = user && !!user.token; // Verificar si el usuario está autenticado
      if (this.isAuthenticated) {



      } else {
        this.isAuthenticated=false;
      }

      setTimeout(() => {
        this.isLoading = false;  // Cambia el estado de carga a false cuando se obtiene la información
      }, 450);
      this.delayLoader = false; // Cambio el estado del delay del loader
    });

  }

  getdecks(): void {
    this.decks.veralldecks()
      .subscribe(      (data) => {
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
                  // Obtener información adicional del entrenador para cada mazo
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
        console.error('Error al cargar los mazos:', error);
      });
  }

  calculateDeckPrices(): void {
    this.mazos.forEach(mazo => {
      let totalPrice = 0;
      const cardRequests = mazo.deckcards.map((card: { cardid: string | null; quantity: number; }) =>
        this.pokemonservice.getPokemonCardById(card.cardid).toPromise()
          .then(response => {
            const cardmarketPrice = response.data.cardmarket?.prices?.averageSellPrice || 0;
            totalPrice += cardmarketPrice * card.quantity;
          })
      );

      Promise.all(cardRequests).then(() => {
        mazo.price = parseFloat(totalPrice.toFixed(2));
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
