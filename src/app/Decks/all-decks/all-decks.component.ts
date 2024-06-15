import { Component } from '@angular/core';
import { DecksService } from '../../decks.service';

@Component({
  selector: 'app-all-decks',
  templateUrl: './all-decks.component.html',
  styleUrl: './all-decks.component.css'
})
export class AllDecksComponent {

  mazos: any[] = [];
  constructor(private decks:DecksService){}

  ngOnInit(): void {
    this.getdecks();

  }

  getdecks(): void {
    this.decks.veralldecks()
      .subscribe((data) => {
        this.mazos = data.map(deck => ({
          id: deck.id,
          name: deck.name,
          description: deck.description,
          creationDate: deck.creationDate,
          type: deck.type,
          trainerId: deck.trainerId,
          image: deck.image ? `data:image/jpeg;base64,${deck.image}` : 'default-image-url',

        }));
      });
  }
}
