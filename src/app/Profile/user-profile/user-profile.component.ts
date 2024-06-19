import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { TrainerService } from '../../trainer.service';

import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  currentUser: any = {};
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;  // Variable para la vista previa de la imagen

  isLoading: boolean = true;  // Variable para el estado de carga
  delayLoader: boolean = true; // Variable para el delay del loader

  constructor(private authService: AuthService, private trainerService: TrainerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user && user.token) {
        this.decodeAndFetchTrainer(user.token);
      }
    });
  }

  decodeAndFetchTrainer(token: string) {
    try {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.userid;

      this.trainerService.getTrainerByUserId(userId).subscribe(
        trainer => {
          this.currentUser = {
            id: trainer.id,
            username: trainer.username,
            photo: trainer.image ? `data:image/jpeg;base64,${trainer.image}` : 'default-image-url',
            bio: trainer.biografia,
            email: trainer.user_email
          };

          setTimeout(() => {
            this.isLoading = false;  // Cambia el estado de carga a false cuando se obtiene la información
          }, 450);
          this.delayLoader = false; // Cambia el estado del delay del loader
        },
        error => {
          console.error('Error fetching trainer data', error);
        }
      );
    } catch (error) {
      console.error('Error decoding token', error);
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      if (this.selectedFile) { // Add a null check here
        reader.readAsDataURL(this.selectedFile);
      }

      reader.onload = () => {
        this.imagePreview = reader.result;
      };
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('id', this.currentUser.id);
    formData.append('biografia', this.currentUser.bio);
    if (this.selectedFile) { // Add a null check here
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.trainerService.updateProfile(formData).subscribe(response => {
      this.authService.updateCurrentUser({ token: this.authService.currentUserValue.token });
      this.decodeAndFetchTrainer(this.authService.currentUserValue.token);
    });
  }
}
