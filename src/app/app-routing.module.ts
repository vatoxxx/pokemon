import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './body/body.component';
import { LoginComponent } from './login/login.component';
import { AllDecksComponent } from './Decks/all-decks/all-decks.component';
import { AuthGuard } from './AuthGuard'; // Importa la guardia de ruta creada
import { AllCardsComponent } from './Cards/all-cards/all-cards.component';
import { ExpansionsComponent } from './Cards/expansions/expansions.component';
import { ExpansionDetailComponent } from './Cards/expansion-detail/expansion-detail.component';
import { CardDetailComponent } from './Cards/card-detail/card-detail.component';
import { CardsBannedComponent } from './Cards/cards-banned/cards-banned.component';
import { UserProfileComponent } from './Profile/user-profile/user-profile.component';
import { BuildDeckComponent } from './Decks/build-deck/build-deck.component';
import { UserDecksComponent } from './Profile/user-decks/user-decks.component';

const routes: Routes = [
{path:'',component:BodyComponent},
{path:'Login',component:LoginComponent,canActivate: [AuthGuard] },
{path:'Home',component:BodyComponent},
{path:'Decks',component:AllDecksComponent},
{path:'Cards',component:AllCardsComponent},
{path:'Expansions',component:ExpansionsComponent},
{ path: 'Expansions/:id', component: ExpansionDetailComponent },
{ path: 'Cards/:id', component: CardDetailComponent },
{ path: 'Banned', component: CardsBannedComponent },
{ path: 'Profile', component: UserProfileComponent },
{ path: 'Build', component: BuildDeckComponent },
{ path: 'User-Decks', component: UserDecksComponent }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
