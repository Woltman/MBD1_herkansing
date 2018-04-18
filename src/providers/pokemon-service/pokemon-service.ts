import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the PokemonServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PokemonServiceProvider {
  apiUrl: string = "https://pokeapi.co/api/v2";

  constructor(private http: HttpClient) {
    console.log('Hello PokemonServiceProvider Provider');
  }

  public GetPokemon() : Observable<any>{
    console.log("is called");
    return this.http.get<any[]>(`${this.apiUrl}/pokemon/`);
  }

  public GetPokemonByName(name: string) : Observable<any>{
    console.log("is called");
    return this.http.get<any[]>(`${this.apiUrl}/pokemon/${name}/`);
  }

  public Get(url: string) : Observable<any>{
    return this.http.get<any[]>(url);
  }
}
