import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DecksService } from '../../decks.service';
import { filter } from 'rxjs';
import { PokemonService } from '../../pokemon.service';
import { AuthService } from '../../auth.service';
import { jwtDecode } from 'jwt-decode';
import { TrainerService } from '../../trainer.service';

@Component({
  selector: 'app-standard',
  templateUrl: './standard.component.html',
  styleUrl: './standard.component.css'
})
export class StandardComponent {

  isLoading: boolean = true;  // Variable para el estado de carga
  delayLoader: boolean = true; // Variable para el delay del loader

  mazos: any[] = []; // Inicializa como array
  userid:number=0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedDecks: any[] = [];
  totalPages: number = 0;
  tipo: string = '';
  isAuthenticated: boolean = false; // Variable para verificar si el usuario está logeado

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deckService: DecksService,
    private pokemonservice:PokemonService,
    private authService:AuthService,
    private trainerService: TrainerService
  ) {
    // Suscripción al evento NavigationEnd para detectar cambios en la ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadData();
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = user && !!user.token; // Verificar si el usuario está autenticado
      if (this.isAuthenticated) {

      } else {
        this.isAuthenticated=false;
      }

      setTimeout(() => {
        this.isLoading = false;  // Cambia el estado de carga a false cuando se obtiene la información
      }, 750);
      this.delayLoader = false; // Cambio el estado del delay del loader
    });

  }

  loadData(): void {
    const tipo = this.route.snapshot.paramMap.get('tipo'); // Obtener el tipo de la ruta actual
    if (tipo) {
      this.tipo = tipo; // Asignar el valor solo si tipo no es null
      this.deckService.getDecksByType(tipo).subscribe(
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





        },
        (error) => {
          console.error('Error al cargar los mazos:', error);
        });
    }
  }

  calculateDeckPrices(): void {
    this.mazos.forEach(mazo => {
      let totalPrice = 0;
      let cardRequests = mazo.deckcards.map((card: { cardid: string | null; quantity: number; }) =>
        this.pokemonservice.getPokemonCardById(card.cardid).toPromise()
          .then(response => {
            console.log(response);
            const cardPrice = response.data.cardmarket.prices.averageSellPrice;
            totalPrice += cardPrice * card.quantity;
          })
      );
      Promise.all(cardRequests).then(() => {
        mazo.price = totalPrice;
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
