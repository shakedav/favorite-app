import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMusicCollection } from '../model/collection.model';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  constructor(private restService: RestService) {}

  getFavoritesCollections() {
    return this.restService.get<IMusicCollection[]>(
      'http://localhost:3000/v1/favorites/all'
    );
  }

  public getCollections() {
    return this.restService.get<IMusicCollection[]>(
      'http://localhost:3000/v1/collections'
    );
  }

  updateFavorite(collection: IMusicCollection) {
    return this.restService.post(
      'http://localhost:3000/v1/favorites/update',
      collection
    );
  }
}
