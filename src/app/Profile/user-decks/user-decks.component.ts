import { Component, OnInit } from '@angular/core';
import { DeckDTO, DecksService } from '../../decks.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-decks',
  templateUrl: './user-decks.component.html',
  styleUrl: './user-decks.component.css'
})
export class UserDecksComponent implements OnInit {

  mazos: any[] = []; // Inicializa como array


  constructor(private route: ActivatedRoute,private deckService: DecksService) { }

  ngOnInit(): void {
    this.loadDecksByTrainer();
  }

  loadDecksByTrainer(): void {
    const trainerId = 1; // Ajusta según el ID del entrenador
    this.deckService.getDecksByTrainer(trainerId).subscribe(
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



}

