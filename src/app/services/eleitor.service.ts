import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Eleitor } from '../models/eleitor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EleitorService {


  constructor() { }

  http = inject(HttpClient);

  api = "http://localhost:8080/api/eleitor";

  save(eleitor: Eleitor): Observable<string>{
    return this.http.post<string>(this.api +"/save", eleitor, {responseType: "text" as "json"});
  }

  update(eleitor: Eleitor, id : number) : Observable<string>{
    return this.http.put<string>(this.api+ `/updade/${id}`, eleitor, {responseType: "text" as "json"})
  }

  delete(id : number) : Observable<string>{
    return this.http.delete<string>(this.api+ `/delete/${id}`, {responseType: "text" as "json"})
  }

  findAll() : Observable<Eleitor[]>{
    return this.http.get<Eleitor[]>(this.api+ "/findAll")
  }

  findById(id: number) : Observable<Eleitor>{
    return this.http.get<Eleitor>(this.api+"/findById/"+ id)
  } 


}
