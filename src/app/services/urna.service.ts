import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Voto } from '../models/voto';
import { Observable } from 'rxjs';
import { Apuracao } from '../models/apuracao';

@Injectable({
  providedIn: 'root'
})
export class UrnaService {

  http = inject(HttpClient);

  api = "http://localhost:8080/api/votos";

  constructor() { }

  votar(voto : Voto, eleitorId : number) : Observable<string> {
    return this.http.post<string>(this.api +`/votar/${eleitorId}`, {});
  }

  realizarApuração() : Observable<Apuracao>{
    return this.http.get<Apuracao>(this.api + "/apuracao")    
  }

}
