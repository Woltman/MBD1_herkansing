import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { OnDestroy } from '@angular/core';
import { PokemonServiceProvider } from '../../providers/pokemon-service/pokemon-service'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

/*
  Generated class for the PokemonCaughtProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PokemonCaughtProvider implements OnDestroy {
  caughtPokemon: any[] = [];
  caughtPokemonLookup = {};
  public pokemon: Subject<any>;

  constructor(public http: HttpClient, private storage: Storage, private pokemonServiceProvider: PokemonServiceProvider) {

    storage.get("caughtpokemon")
      .then(result => {
        if (result != null) {
          
          JSON.parse(result).forEach(element => {
            let p = this.caughtPokemon.find(pokemon => pokemon.name == element.name);
            if(p){
                if(p.amount){
                  p.amount++;
                }
                else p.amount = 2;
            }
            else{
                this.caughtPokemon.push(element);
            }
          });

          this.caughtPokemonLookup = this.caughtPokemon.reduce(
            (result, element) => ({ ...result, [element.name]: true }), 
            { }
          );
        }
      })
      .catch(err => console.log(`error: ${err.message}`))
  }

  public catch(data: any) {
    this.caughtPokemon.push(data);
    this.caughtPokemonLookup[data.name] = true;
    this.save();
  }

  public isCaught(name) {
    return !!this.caughtPokemonLookup[name];
  }

  public getPokemon() {
    return this.caughtPokemon;
  }

  public save() {
    this.storage.set("caughtpokemon", JSON.stringify(this.caughtPokemon));
  }

  public clearStorage() {
    this.storage.clear();
    this.caughtPokemon = [];
    this.caughtPokemonLookup = {};
  }

  ngOnDestroy() {
    this.storage.set("caughtpokemon", JSON.stringify(this.caughtPokemon));
    console.log("On destroy provider called");
  }
}
