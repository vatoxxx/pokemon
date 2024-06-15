import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentRequestDTO, CommentResponseDTO, DecksService } from '../../decks.service';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-deck-detail',
  templateUrl: './deck-detail.component.html',
  styleUrl: './deck-detail.component.css'
})
export class DeckDetailComponent {

  deck: any[] = []; // Inicializa como array vacío
  mazos: any={}; // Inicializa como array
  card:any;

  comments: CommentResponseDTO[] = []; // Añadir una propiedad para los comentarios
  newComment: CommentRequestDTO = {
    content: '',
    deckId: 0,
    trainerId: 1, // Asignar el ID del entrenador correspondiente
    likes: 0,
    dislikes: 0
  };

  constructor(private route: ActivatedRoute, private decks: DecksService,private pokemon:PokemonService) { }

  ngOnInit(): void {
    const deckId = this.route.snapshot.paramMap.get('id');
    if (deckId) {

      this.newComment.deckId = parseInt(deckId, 10); // Asignar el ID del mazo al nuevo comentario



      this.decks.getDeckbyid(parseInt(deckId, 10)).subscribe(data=>{

        console.log(data)
        this.mazos = {
          id: data.id,
          name: data.name,
          description: data.description,
          creationDate: data.creationDate,
          type: data.type,
          trainerId: data.trainerId,
          image: data.image ? `data:image/jpeg;base64,${data.image}` : 'default-image-url'
        };




      });
      this.decks.getCardsbydeck(parseInt(deckId, 10)).subscribe(data => {
        this.deck = data.map(card => {
          this.pokemon.getPokemonCardById(card.cardid).subscribe(pokemonData => {
            Object.assign(card, {
              image: pokemonData.data.images.small, // Ajusta según el nombre de la propiedad en la respuesta
              quantity: card.quantity // Mantén la cantidad
            });
          });
          return card;
        });
      });




      this.loadComments(parseInt(deckId, 10));



    }










  }

  loadComments(deckId: number): void {
    this.decks.getcommentsbydeckid(deckId).subscribe(data => {
      this.comments = data;
      console.log(data)
    });
  }



  addComment(): void {



    this.decks.addComment(this.newComment).subscribe(data => {
      this.comments.push(data);
      this.newComment.content = ''; // Limpiar el campo de contenido después de agregar el comentario
    });
  }

  likeComment(comment: CommentResponseDTO): void {
    comment.likes++;
    // Aquí puedes añadir la lógica para actualizar los likes en el servidor
  }

  dislikeComment(comment: CommentResponseDTO): void {
    comment.dislikes++;
    // Aquí puedes añadir la lógica para actualizar los dislikes en el servidor
  }






  }
