import { Component, OnInit } from '@angular/core';
import { DeckDTO, DecksService } from '../../decks.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { jwtDecode } from 'jwt-decode';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-user-decks',
  templateUrl: './user-decks.component.html',
  styleUrls: ['./user-decks.component.css']
})
export class UserDecksComponent implements OnInit {

  mazos: any[] = []; // Inicializa como array
  userid:number=0;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  paginatedDecks: any[] = [];
  totalPages: number = 0;

  isLoading: boolean = true;  // Variable para el estado de carga
  delayLoader: boolean = true; // Variable para el delay del loader

  showDeleteConfirm: boolean = false; // Estado para mostrar la confirmación de eliminación
  deckToDelete: number | null = null; // ID del deck a eliminar

  constructor(private route: ActivatedRoute, private deckService: DecksService, private authservice: AuthService, private pokemonservice: PokemonService) { }

  ngOnInit(): void {
    this.loadDecksByTrainer();
  }

  loadDecksByTrainer(): void {
    this.authservice.currentUser.subscribe(user => {
      if (user && user.token) {
        this.userid = this.decodeAndFetchTrainer(user.token);
      }
    });

    this.deckService.getDecksByTrainer(this.userid).subscribe(
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
        this.calculateDeckPrices();

        setTimeout(() => {
          this.isLoading = false;  // Cambia el estado de carga a false cuando se obtiene la información
        }, 450);
        this.delayLoader = false; // Cambio el estado del delay del loader
      },
      (error) => {
        console.error('Error al cargar los mazos:', error);
      }
    );
  }

  decodeAndFetchTrainer(token: string) {
    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.userid;
    return userId;
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

  confirmDeleteDeck(deckId: number): void {
    this.deckToDelete = deckId;
    this.showDeleteConfirm = true;
  }

  deleteDeck(): void {
    if (this.deckToDelete !== null) {
      this.deckService.deleteDeck(this.deckToDelete).subscribe(
        () => {
          this.mazos = this.mazos.filter(deck => deck.id !== this.deckToDelete);
          this.updatePaginatedDecks();
          this.showDeleteConfirm = false;
          this.deckToDelete = null;
        },
        (error) => {
          console.error('Error al eliminar el mazo:', error);
          this.showDeleteConfirm = false;
          this.deckToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deckToDelete = null;
  }
}

