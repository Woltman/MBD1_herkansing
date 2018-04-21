import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { PokemonServiceProvider } from '../../providers/pokemon-service/pokemon-service'
import { PokemonDetailPage } from '../pokemon-detail/pokemon-detail';
import { CapitalizePipe } from '../../pipes/capitalize/capitalize'
import { PokemonCaughtProvider } from '../../providers/pokemon-caught/pokemon-caught';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  pokemon: any[];
  nextPage: string;

  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController, 
    private pokemonService: PokemonServiceProvider
  ) {
    this.nextPage = "https://pokeapi.co/api/v2/pokemon/";
    this.doInfinite();
  }

  GetPokemon() {
    let tempPokemon = [];
    this.pokemonService.GetPokemon().subscribe(data => {
      console.log(JSON.stringify(data.results));
      data.results.forEach(element => {
        this.pokemonService.GetPokemonByName(element.name)
          .subscribe(pokemon => tempPokemon.push(pokemon));
      })
      this.pokemon = tempPokemon;
      this.nextPage = data.next;
    }, error => {
      console.log("error")
    });
  }

  doInfinite() {
    console.log('Begin async operation');

    const currentPokemon = !!this.pokemon && this.pokemon.length;

    return this.pokemonService.Get(this.nextPage).toPromise()
      .then(data => {
        this.nextPage = data.next;
        console.log(JSON.stringify(data.results));
        if(!Array.isArray(this.pokemon)) {
          this.pokemon = [];
        }
        
        this.pokemon.push(
          ...data.results.map((element, index) => ({
            name: element.name,
            sprites: { front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentPokemon + index + 1}.png` }
          }))
        );
        return data;

        // return Promise.all(
        //   data.results.map((element) => this.pokemonService.GetPokemonByName(element.name).toPromise())
        // ).then(pokemons => {
        //   this.pokemon.push(...pokemons);
        //   this.nextPage = data.next;

        //   console.log('Async operation has ended');

        //   return pokemons;
        // });
      }, err => console.log(`error: ${err.message}`));
  }

  //not yet solved bug by angular
  scrollToTop() {
    try {
      this.content.scrollToTop();
    }
    catch (error) {
      console.log(`error: ${error.message}`)
    }

  }
}
