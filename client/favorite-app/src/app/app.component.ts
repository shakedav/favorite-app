import { Component, OnInit } from '@angular/core';
import { IMusicCollection } from './model/collection.model';
import { FavoritesService } from './services/favorites.service';
import { SessionStorageService } from './services/session-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'favorite-app';
  public collections: IMusicCollection[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.collections = this.sessionStorageService.getItem('collections');
    if (!this.collections) {
      this.favoritesService.getCollections().subscribe((response) => {
        this.collections = response;
        this.setFavoriteAlbums();
        this.setCollectionInStorage();
      });
    }
  }

  setFavoriteAlbums() {
    if (!this.collections) {
      return;
    }
    this.favoritesService
      .getFavoritesCollections()
      .subscribe((favoriteAlbums) => {
        this.collections.map((albumFromItunes) => {
          const album = favoriteAlbums.find((favoriteAlbum) => {
            return (
              favoriteAlbum.collectionName == albumFromItunes.collectionName
            );
          });
          albumFromItunes.isFavorite = album?.isFavorite!;
        });
        this.setCollectionInStorage();
      });
  }
  setCollectionInStorage() {
    this.sessionStorageService.setItem(
      'collections',
      JSON.stringify(this.collections)
    );
  }

  onAlbumClick(collection: IMusicCollection) {
    this.favoritesService.updateFavorite(collection).subscribe((response) => {
      this.collections.map((album) => {
        if (
          album.collectionName == (<IMusicCollection>response).collectionName
        ) {
          album.isFavorite = (<IMusicCollection>response).isFavorite;
        }
      })!;
      this.sessionStorageService.setItem(
        'collections',
        JSON.stringify(this.collections)
      );
    });
  }
}
