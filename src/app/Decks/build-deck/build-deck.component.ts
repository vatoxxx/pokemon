import { Component } from '@angular/core';
import { PokemonCard, PokemonService, PokemonSet } from '../../pokemon.service';
import { DecksService } from '../../decks.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-build-deck',
  templateUrl: './build-deck.component.html',
  styleUrls: ['./build-deck.component.css']
})
export class BuildDeckComponent {
  pokemonSets: PokemonSet[] = []; // Populate with actual data

  pokemonTypes: any[] = [];
  pokemonSubtypes: any[] = [];
  pokemonSupertypes: any[] = [];
  pokemonRarities: any[] = [];
  searchTerm: string = '';
  filters: any = {};
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;

  deckCoverImage = '';

  pokemonCards: PokemonCard[] = [];
  deck: PokemonCard[] = [];

  showDeckForm = false;
  deckName = '';
  deckType = 'standard';
  deckDescription = '';
  Deckimage: File | null = null;

  isLoading: boolean = true;  // Variable para el estado de carga
  delayLoader: boolean = true; // Variable para el delay del loader

 userid:number=0;

  currentTotalQuantity: number = 0; // Define currentTotalQuantity as a property

  constructor(private pokemonService: PokemonService, private decks: DecksService,private authService:AuthService,private router: Router
  ) {}

  ngOnInit(): void {
    this.searchCards();
    this.loadFilters();


  }

  loadFilters(): void {
    this.pokemonService.getAllSets().subscribe(data => (this.pokemonSets = data.data));
    this.pokemonService.getAllTypes().subscribe(data => (this.pokemonTypes = data.data));
    this.pokemonService.getAllSubtypes().subscribe(data => (this.pokemonSubtypes = data.data));
    this.pokemonService.getAllSupertypes().subscribe(data => (this.pokemonSupertypes = data.data));
    this.pokemonService.getAllRarities().subscribe(data => (this.pokemonRarities = data.data));
  }

  sanitizeFilter(value: string): string {
    return value.replace(/\s+/g, '*');
  }

  searchCards() {

    this.filters.set = this.sanitizeFilter(this.filters.set || '');
    this.filters.type = this.sanitizeFilter(this.filters.type || '');
    this.filters.subtype = this.sanitizeFilter(this.filters.subtype || '');
    this.filters.supertype = this.sanitizeFilter(this.filters.supertype || '');
    this.filters.rarity = this.sanitizeFilter(this.filters.rarity || '');
    this.filters.legalities = this.sanitizeFilter(this.filters.legalities || '');


    this.currentPage = 1;
    this.pokemonService.searchCards(this.filters, this.searchTerm, this.currentPage, this.pageSize).subscribe(data => {
      this.pokemonCards = data.data;
      this.totalPages = Math.ceil(data.totalCount / this.pageSize);

      setTimeout(() => {
        this.isLoading = false;  // Cambia el estado de carga a false cuando se obtiene la información
      }, 450);
      this.delayLoader = false; // Cambio el estado del delay del loader
    });
  }

  loadMoreCards() {
    this.currentPage++;
    if (this.currentPage <= this.totalPages) {
      this.pokemonService.searchCards(this.filters, this.searchTerm, this.currentPage, this.pageSize).subscribe(data => {
        this.pokemonCards = this.pokemonCards.concat(data.data); // Agrega nuevas cartas a las existentes
        this.totalPages = Math.ceil(data.totalCount / this.pageSize);
      });
    }
  }

  addToDeck(card: PokemonCard) {
    const isEnergyCard = card.supertype.includes('Energy');
    const existingCard = this.deck.find(c => c.id === card.id);

    const sameIdCards = this.deck.filter(c => c.name === card.name && !isEnergyCard);
    const totalQuantity = sameIdCards.reduce((total, c) => total + c.quantity, 0);

    // Calcular la suma actual de las cantidades en el deck
    const currentTotalQuantity = this.deck.reduce((total, c) => total + c.quantity, 0);

    this.currentTotalQuantity = currentTotalQuantity;

    if (currentTotalQuantity < 60) {
      if (existingCard) {
        // Si la carta no es de tipo energía y es la misma carta por ID
        if (!isEnergyCard) {
          // Verificar si ya hay 4 cartas con el mismo ID
          if (totalQuantity >= 4) {
            alert(`Ya hay 4 cartas con el nombre "${card.name}" en el deck.`);
            return;
          }
        }

        existingCard.quantity++;
      } else if (totalQuantity < 4) {
        // Si la carta no está en el deck, agregarla con cantidad 1
        this.deck.push({ ...card, quantity: 1 });
      }else{
        alert(`Ya hay 4 cartas con el nombre "${card.name}" en el deck.`);
      }
    } else {
      alert('El deck ya tiene 60 cartas.');
    }
  }

  openDeckForm() {
    this.showDeckForm = true;
  }

  saveDeck() {
    const deckData = {
      name: this.deckName,
      type: this.deckType,
      description: this.deckDescription
    };

    const sanitizedDeckCards = this.deck.map(card => {
      return {
        cardid: card.id,
        quantity: card.quantity
      };
    });

    const deckCardsJson = JSON.stringify(sanitizedDeckCards);

    this.authService.currentUser.subscribe(user => {
      if (user && user.token) {
       this.userid= this.decodeAndFetchTrainer(user.token);
      }
    });

    this.decks.createDeck(deckData, this.Deckimage, this.userid, deckCardsJson).subscribe(
      (response) => {
        console.log('Deck creado exitosamente:', response);
        const deckId = response.id;
        this.resetDeckForm();
        this.router.navigate(['/User-Decks']).then(() => {
          window.location.reload(); // Forzar la recarga de la página
        });
      },
      (error) => {
        console.error('Error al crear el deck:', error);
      }
    );
  }

  decodeAndFetchTrainer(token: string) {

      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.userid;



    return userId;

  }



  resetDeckForm() {
    this.deckName = '';
    this.deckType = 'standard';
    this.deckDescription = '';
    this.Deckimage = null;
    this.deck = [];
    this.showDeckForm = false;
    this.currentTotalQuantity=0;
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.Deckimage = event.target.files[0];
    }
  }
}
