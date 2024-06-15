import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {  HttpClientModule , HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { JwtInterceptor } from './jwtinterceptor.service';
import { FormsModule } from '@angular/forms';
import { AllDecksComponent } from './Decks/all-decks/all-decks.component';
import { StandardComponent } from './Decks/standard/standard.component';
import { AllCardsComponent } from './Cards/all-cards/all-cards.component';
import { ExpansionsComponent } from './Cards/expansions/expansions.component';
import { CardDetailComponent } from './Cards/card-detail/card-detail.component';
import { ExpansionDetailComponent } from './Cards/expansion-detail/expansion-detail.component';
import { CardsBannedComponent } from './Cards/cards-banned/cards-banned.component';
import { UserProfileComponent } from './Profile/user-profile/user-profile.component';
import { UserDecksComponent } from './Profile/user-decks/user-decks.component';
import { UserFavcardsComponent } from './Profile/user-favcards/user-favcards.component';
import { BuildDeckComponent } from './Decks/build-deck/build-deck.component';
import { DeckDetailComponent } from './Decks/deck-detail/deck-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    BodyComponent,
    LoginComponent,
    AllDecksComponent,
    StandardComponent,
    AllCardsComponent,
    ExpansionsComponent,
    CardDetailComponent,
    ExpansionDetailComponent,
    CardsBannedComponent,
    UserProfileComponent,
    UserDecksComponent,
    UserFavcardsComponent,
    BuildDeckComponent,
    DeckDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CarouselModule.forRoot(),
    FormsModule
  ],
  providers: [ AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
