import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './body/body.component';
import { LoginComponent } from './login/login.component';
import { AllDecksComponent } from './Decks/all-decks/all-decks.component';
import { AuthGuard } from './AuthGuard'; // Importa la guardia de ruta creada
import { AllCardsComponent } from './Cards/all-cards/all-cards.component';

const routes: Routes = [
{path:'',component:BodyComponent},
{path:'Login',component:LoginComponent,canActivate: [AuthGuard] },
{path:'Home',component:BodyComponent},
{path:'Decks',component:AllDecksComponent},
{path:'Cards',component:AllCardsComponent}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
