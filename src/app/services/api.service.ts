import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment as env } from '@enviroments/environment';
import { Observable, shareReplay } from 'rxjs';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // constructor() { }

  #http = inject(HttpClient);
  #url = signal(env.apiGateway);
  #session = inject(SessionStorageService);

  #tokenKey = 'auth_token';

  httpGet$(urlExtended: string): Observable<any> {
    return this.#http.get<any>(this.#url() + urlExtended).pipe(shareReplay());
  }

  httpPost$(
    urlExtended: string,
    props: { email: string; password: string }
  ): Observable<any> {
    return this.#http.post<any>(this.#url() + urlExtended, props);
  }

  setToken(token: string): void {
    this.#session.setItem(this.#tokenKey, token);
  }

  getToken(): string {
    return this.#session.getItem(this.#tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.#session.removeItem(this.#tokenKey);
  }
}
