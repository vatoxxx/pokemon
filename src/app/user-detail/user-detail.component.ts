import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainerService } from '../trainer.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent {

  username: string|null='';
  trainerDetails: any;

  constructor(private route: ActivatedRoute, private trainersService: TrainerService) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username'); // Obtener el username de la ruta

    this.trainersService.getUserDetails(this.username)
      .subscribe(
        (data) => {
          this.trainerDetails = {
            username: data.username,
            image: data.image ? `data:image/jpeg;base64,${data.image}` : 'default-image-url',
            biografia: data.biografia,
            numberOfDecks: data.numberOfDecks
          };
        },
        (error) => {
          console.error('Error al cargar los detalles del entrenador:', error);
          // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje de error en la interfaz.
        }
      );
  }
}
