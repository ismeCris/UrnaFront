import { inject, Injectable } from '@angular/core';
import { Candidato } from '../models/candidato';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/candidatos';

  constructor() { }

  findAll(): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(this.API+"/findAll");
  }

  findById(id: number): Observable<Candidato> {
    return this.http.get<Candidato>(this.API+"/findById/"+id);
  }

  update(candidato: Candidato): Observable<string> {
    return this.http.put<string>(this.API+"/update/"+candidato.id, candidato, {responseType: 'text' as 'json'});
  }

  save(candidato: Candidato): Observable<string> {
    return this.http.post<string>(this.API+"/save",candidato, {responseType: 'text' as 'json'});
  }

  delete(id: number): Observable<string> {
    return this.http.put(this.API + "/delete/" + id, null, { responseType: 'text' });
}


  getPrefeitosAtivos(): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(this.API+"/prefeAtivos");
  }

  getVereadoresAtivos(): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(this.API+"/vereAtivos");
  }
  
  
  
}
