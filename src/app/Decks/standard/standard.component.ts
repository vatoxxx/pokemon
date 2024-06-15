import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DecksService } from '../../decks.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-standard',
  templateUrl: './standard.component.html',
  styleUrl: './standard.component.css'
})
export class StandardComponent {

  mazos: any[] = [];
  tipo: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deckService: DecksService
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
          }));
        },
        (error) => {
          console.error('Error al cargar los mazos:', error);
        }
      );
    }
  }


}
