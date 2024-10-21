import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apuracao } from '../models/apuracao';

@Injectable({
  providedIn: 'root'
})
export class ApuracaoService {

  private API = 'http://localhost:8080/api/votos'; 

  constructor(private http: HttpClient) { }

  getApuracao(): Observable<Apuracao> {
    return this.http.get<Apuracao>(this.API+"/apuracao");
  }
}
