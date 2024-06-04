import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { 

  }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public saveObjectData(key: string, value: object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getData(key: string): string | any {
    return localStorage.getItem(key)
  }

  public getObjectData(key: string): any {
    return JSON.parse(localStorage.getItem(key) ?? '')
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
}

