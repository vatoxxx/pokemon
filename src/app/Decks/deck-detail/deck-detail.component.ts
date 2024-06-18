import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentRequestDTO, CommentResponseDTO, DecksService } from '../../decks.service';
import { PokemonService } from '../../pokemon.service';
import { TrainerService } from '../../trainer.service'; // Asegúrate de tener este servicio importado

@Component({
  selector: 'app-deck-detail',
  templateUrl: './deck-detail.component.html',
  styleUrls: ['./deck-detail.component.css']
})
export class DeckDetailComponent implements OnInit {
  deck: any[] = [];
  mazos: any = {};
  card: any;
  trainer: any; // Añadido para almacenar la información del entrenador

  comments: CommentResponseDTO[] = [];
  newComment: CommentRequestDTO = {
    content: '',
    deckId: 0,
    trainerId: 1,
    likes: 0,
    dislikes: 0
  };

  tcgplayerTotal: number = 0;
  cardmarketTotal: number = 0;

  constructor(
    private route: ActivatedRoute,
    private decks: DecksService,
    private pokemon: PokemonService,
    private trainerService: TrainerService // Asegúrate de inyectar este servicio
  ) { }

  ngOnInit(): void {
    const deckId = this.route.snapshot.paramMap.get('id');
    if (deckId) {
      this.newComment.deckId = parseInt(deckId, 10);

      this.decks.getDeckbyid(parseInt(deckId, 10)).subscribe(data => {
        this.mazos = {
          id: data.id,
          name: data.name,
          description: data.description,
          creationDate: data.creationDate,
          type: data.type,
          trainerId: data.trainerId,
          image: data.image ? `data:image/jpeg;base64,${data.image}` : 'default-image-url',
          deckcards: data.deckCards || [] // Asegúrate de que deckcards está definido
        };

        this.getTrainerInfo(this.mazos.trainerId); // Obtener la información del entrenador

        // Calcular los precios del mazo solo si hay cartas en el mazo

          this.calculateDeckPrices();

      });

      this.decks.getCardsbydeck(parseInt(deckId, 10)).subscribe(data => {
        this.deck = data.map(card => {
          this.pokemon.getPokemonCardById(card.cardid).subscribe(pokemonData => {
            Object.assign(card, {
              image: pokemonData.data.images.small,
              quantity: card.quantity
            });
          });
          return card;
        });
      });

      this.loadComments(parseInt(deckId, 10));
    }
  }

  getTrainerInfo(trainerId: number): void {
    this.trainerService.getTrainerByUserIddeck(trainerId).subscribe(trainer => {
      this.trainer = {
        username: trainer.username,
        image: trainer.image ? `data:image/jpeg;base64,${trainer.image}` : 'default-image-url'
      };
    });
  }

  loadComments(deckId: number): void {
    this.decks.getcommentsbydeckid(deckId).subscribe(data => {
      this.comments = data;
    });
  }

  addComment(): void {
    this.decks.addComment(this.newComment).subscribe(data => {
      this.comments.push(data);
      this.newComment.content = '';
    });
  }

  likeComment(comment: CommentResponseDTO): void {
    comment.likes++;
    // Lógica para actualizar los likes en el servidor
  }

  dislikeComment(comment: CommentResponseDTO): void {
    comment.dislikes++;
    // Lógica para actualizar los dislikes en el servidor
  }

  calculateDeckPrices(): void {
    console.log("buenas")
    this.cardmarketTotal = 0;
    this.tcgplayerTotal = 0;
    const cardRequests = this.mazos.deckcards.map((card: { cardid: string | null; quantity: number; }) =>
      this.pokemon.getPokemonCardById(card.cardid).toPromise()
        .then(response => {
          console.log(response)
          const cardmarketPrice = response.data.cardmarket?.prices?.averageSellPrice || 0;
          const tcgplayerPrice = response.data.tcgplayer?.prices?.normal.market || 0;
          this.cardmarketTotal += cardmarketPrice * card.quantity;
          this.tcgplayerTotal += tcgplayerPrice * card.quantity;
        })
    );

    Promise.all(cardRequests).then(() => {
      console.log('CardMarket Total:', this.cardmarketTotal);
      console.log('TCGPlayer Total:', this.tcgplayerTotal);
    }).catch(error => {
      console.error('Error al obtener los precios de las cartas:', error);
    });
  }
}
