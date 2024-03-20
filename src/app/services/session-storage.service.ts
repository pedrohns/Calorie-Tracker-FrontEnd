import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  constructor() {}

  // Método para armazenar um valor na sessionStorage
  setItem(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  // Método para recuperar um valor da sessionStorage
  getItem(key: string): any {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // Método para remover um item da sessionStorage
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }
}
