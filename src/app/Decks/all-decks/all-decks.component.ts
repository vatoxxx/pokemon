import { Component } from '@angular/core';
import { DecksService } from '../../decks.service';

@Component({
  selector: 'app-all-decks',
  templateUrl: './all-decks.component.html',
  styleUrl: './all-decks.component.css'
})
export class AllDecksComponent {

  deckss: any[] = [];
  constructor(private decks:DecksService){}

  ngOnInit(): void {
    this.getdecks();

  }

  getdecks(): void {
    this.decks.veralldecks()
      .subscribe((data: any) => {
        this.deckss = data.data;
      });
  }
}
