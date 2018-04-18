import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PokemonServiceProvider } from '../../providers/pokemon-service/pokemon-service'

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
  name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private pokemonService: PokemonServiceProvider) {
    this.name = navParams.get('name');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PokemonDetailPage');
    //TODO load bulbasaur detail page
  }

}
