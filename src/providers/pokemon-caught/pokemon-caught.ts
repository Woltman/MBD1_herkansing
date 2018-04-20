import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { OnDestroy } from '@angular/core';
import { PokemonServiceProvider } from '../../providers/pokemon-service/pokemon-service'

/*
  Generated class for the PokemonCaughtProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PokemonCaughtProvider implements OnDestroy {
  caughtPokemon: any[];

  constructor(public http: HttpClient, private storage: Storage, private pokemonServiceProvider: PokemonServiceProvider) {
    this.caughtPokemon = [];
    storage.get("caughtpokemon")
    .then(result => { if(result != null) JSON.parse(result).forEach(element => {
      this.caughtPokemon.push(element);
    }) 
  })
    .catch(err => console.log(`error: ${err.message}`))
  }

  public catch(data: any){
    this.caughtPokemon.push(data);
    this.save();
  }

  public getPokemon(){
    return this.caughtPokemon;
  }

  public save(){
    this.storage.set("caughtpokemon", JSON.stringify(this.caughtPokemon));
  }

  public clearStorage(){
    this.storage.clear();
  }

  ngOnDestroy(){
    this.storage.set("caughtpokemon", JSON.stringify(this.caughtPokemon));
    console.log("On destroy provider called");
  }
}
