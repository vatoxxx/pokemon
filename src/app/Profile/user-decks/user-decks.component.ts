import { Component, OnInit } from '@angular/core';
import { DeckDTO, DecksService } from '../../decks.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user-decks',
  templateUrl: './user-decks.component.html',
  styleUrl: './user-decks.component.css'
})
export class UserDecksComponent implements OnInit {

  mazos: any[] = []; // Inicializa como array
  userid:number=0;


  constructor(private route: ActivatedRoute,private deckService: DecksService,private authservice:AuthService) { }

  ngOnInit(): void {
    this.loadDecksByTrainer();
  }

  loadDecksByTrainer(): void {

    this.authservice.currentUser.subscribe(user => {
      if (user && user.token) {
       this.userid= this.decodeAndFetchTrainer(user.token);
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

        }));
        }
      ,
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



}

