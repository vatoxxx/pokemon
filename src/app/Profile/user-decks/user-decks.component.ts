import { Component, OnInit } from '@angular/core';
import { DeckDTO, DecksService } from '../../decks.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-decks',
  templateUrl: './user-decks.component.html',
  styleUrl: './user-decks.component.css'
})
export class UserDecksComponent implements OnInit {

  mazos: any = {};



  constructor(private deckService: DecksService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadDecksByTrainer();
  }

  loadDecksByTrainer(): void {
    const trainerId = 1; // Ajusta según el ID del entrenador
    this.deckService.getDecksByTrainer(trainerId).subscribe(
      (data) => {

        console.log(data)

        this.mazos = data.map(deck => ({
          id: deck.id,
          name: deck.name,
          description: deck.description,
          creationDate: deck.creationDate,
          type: deck.type,
          trainerId: deck.trainerId,
          image: deck.image ? `data:image/jpeg;base64,${deck.image}` : 'default-image-url',
          deckCards: deck.deckCards // Asumiendo que deckCards ya está en el formato correcto
        }));
        }
      ,
      (error) => {
        console.error('Error al cargar los mazos:', error);
      }
    );
  }



}

