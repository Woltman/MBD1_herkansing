import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PokemonDetailPage } from '../pokemon-detail/pokemon-detail';
import { PokemonCaughtProvider } from '../../providers/pokemon-caught/pokemon-caught';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  pokemon: any[];

  constructor(public navCtrl: NavController, private pokemonCaughtProvider: PokemonCaughtProvider) {
    this.pokemon = pokemonCaughtProvider.getPokemon();
  }

  public ShowPokemon(pokemonName: string){
    console.log(`show ${pokemonName}`);
    this.navCtrl.push(PokemonDetailPage, { name: pokemonName });
  }

  public clearStorage(){
    this.pokemonCaughtProvider.clearStorage();
  }
}
