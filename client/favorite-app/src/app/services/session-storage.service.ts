import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  setItem(key: string, value: string) {
    window.sessionStorage.setItem(key, value);
  }

  getItem(key: string) {
    const item = window.sessionStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }

  constructor() {}
}
