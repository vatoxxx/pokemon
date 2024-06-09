import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { jwtDecode } from "jwt-decode";
import { TrainerService } from '../trainer.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = {};


  constructor(private authService: AuthService, private trainerService: TrainerService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = user && !!user.token; // Verificar si el usuario está autenticado
      if (this.isAuthenticated) {
        this.decodeAndFetchTrainer(user.token);
      } else {
        this.isAuthenticated=false;
        this.currentUser = {};
      }
    }, error => {
      // Manejar errores de la suscripción si los hay
      console.error('Error subscribing to currentUser:', error);
    });
  }

  decodeAndFetchTrainer(token: string) {
    try {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.userid; // Asegúrate de que el JWT contenga el `id` del usuario

      this.trainerService.getTrainerByUserId(userId).subscribe(
        trainer => {
          console.log("jeiph "+trainer.username)
          this.currentUser = {
            username: trainer.username,
            photo: trainer.image ? `data:image/jpeg;base64,${trainer.image}` : 'default-image-url' // Asegúrate de tener una imagen por defecto
          };
        },
        error => {
          console.error('Error fetching trainer data', error);
        }
      );
    } catch (error) {
      console.error('Error decoding token', error);
    }
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.currentUser = {};
  }
}


