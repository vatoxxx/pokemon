import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentRequestDTO, CommentResponseDTO, DecksService } from '../../decks.service';
import { PokemonService } from '../../pokemon.service';
import { TrainerService } from '../../trainer.service'; // Asegúrate de tener este servicio importado
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-deck-detail',
  templateUrl: './deck-detail.component.html',
  styleUrls: ['./deck-detail.component.css'],
  providers: [DatePipe] // Añade DatePipe aquí si es necesario
})
export class DeckDetailComponent implements OnInit {
  deck: any[] = [];
  mazos: any = {};
  card: any;
  trainer: any; // Añadido para almacenar la información del entrenador
  trainerc: any; // Añadido para almacenar la información del entrenador

  trainerid:number=0;

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
    private trainerService: TrainerService,
  private datePipe: DatePipe
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


      // Inicializar trainerc como un array vacío
      this.trainerc = Array(this.comments.length).fill({});

      // Obtener la información del entrenador para cada comentario
      this.comments.forEach((comment, index) => {
        this.trainerService.getTrainerByUserIddeck(comment.trainerId).subscribe(trainer => {

          this.trainerc[index] = {
            username: trainer.username,
            image: trainer.image ? `data:image/jpeg;base64,${trainer.image}` : 'default-image-url'
          };
        });

        if (typeof comment.creationDateTime === 'string') {
          const dateTimeArray = JSON.parse(comment.creationDateTime);
          this.comments[index].creationDateTime = dateTimeArray;
        }
      });


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
    this.cardmarketTotal = 0;
    this.tcgplayerTotal = 0;

    const cardRequests = this.mazos.deckcards.map((card: { cardid: string | null; quantity: number; }) =>
      this.pokemon.getPokemonCardById(card.cardid).toPromise()
        .then(response => {
          console.log(response);

          // Calcular el precio de CardMarket
          const cardmarketPrice = response.data.cardmarket?.prices?.averageSellPrice || 0;
          this.cardmarketTotal += cardmarketPrice * card.quantity;

          // Calcular el precio de TCGPlayer
          let tcgplayerPrice = 0;
          if (response.data.tcgplayer?.prices?.normal?.market) {
            tcgplayerPrice = response.data.tcgplayer.prices.normal.market;
          } else if (response.data.tcgplayer?.prices?.holofoil?.market) {
            tcgplayerPrice = response.data.tcgplayer.prices.holofoil.market;
          } else if (response.data.tcgplayer?.prices?.reverseHolofoil?.market) {
            tcgplayerPrice = response.data.tcgplayer.prices.reverseHolofoil.market;
          }
          this.tcgplayerTotal += tcgplayerPrice * card.quantity;
        })
    );

    Promise.all(cardRequests).then(() => {
      this.cardmarketTotal = parseFloat(this.cardmarketTotal.toFixed(2));
      this.tcgplayerTotal = parseFloat(this.tcgplayerTotal.toFixed(2));
    }).catch(error => {
      console.error('Error al obtener los precios de las cartas:', error);
    });
  }

  formatCommentDate(creationDateTime: number[] | null): string {
    if (!creationDateTime || creationDateTime.length !== 6) {
      return ''; // Manejar caso cuando creationDateTime es nulo o tiene un formato incorrecto
    }

    const [year, month, day, hours, minutes, seconds] = creationDateTime;

    // Crear objeto Date usando los elementos del array
    const date = new Date(year, month - 1, day, hours, minutes, seconds);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida'; // Manejar caso cuando creationDateTime no es una fecha válida
    }

    const currentDate = new Date();

    const diffMs = currentDate.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `${diffDays} días atrás`;
    } else {
      // Usar DatePipe solo si la fecha es válida
      return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }
  }



}
