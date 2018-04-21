import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar  } from 'ionic-angular';
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
  @ViewChild(Navbar) navBar: Navbar;
  name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private pokemonService: PokemonServiceProvider) {
    this.name = navParams.get('name');
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
