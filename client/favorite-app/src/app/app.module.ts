import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FavoritesService } from './services/favorites.service';
import { RestService } from './services/rest.service';
import { SessionStorageService } from './services/session-storage.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [
    RestService,
    FavoritesService,
    HttpClientModule,
    SessionStorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
