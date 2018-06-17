import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar  } from 'ionic-angular';
import { PokemonServiceProvider } from '../../providers/pokemon-service/pokemon-service'
import { CapitalizePipe } from '../../pipes/capitalize/capitalize'

/**
 * Generated class for the PokemonDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pokemon-detail',
  templateUrl: 'pokemon-detail.html',
})
export class PokemonDetailPage {
  @ViewChild(Navbar) navBar: Navbar;
  name: string;
  id: string;
  type1: string;
  type2: string;
  weight: string;
  height: string;
  species: string;
  spriteUrl: string;
  pokemon: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private pokemonService: PokemonServiceProvider) {
    this.name = navParams.get('name');
    this.GetPokemonDetails();
  }

  GetPokemonDetails() {
    this.pokemonService.GetPokemonByName(this.name)
      .subscribe(pokemon => {
        this.pokemonService.GetSpeciesById(pokemon.id)
          .subscribe(pokemonSpecies => {
            this.species = pokemonSpecies.genera[2].genus;
            this.pokemon = pokemon;
          });      
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PokemonDetailPage');
    this.setBackButtonAction();
  }

  setBackButtonAction(){
    this.navBar.backButtonClick = () => {
     this.navCtrl.pop({ animate: true, animation: 'transition', duration: 500, direction: 'back' });
    }
  }
}
