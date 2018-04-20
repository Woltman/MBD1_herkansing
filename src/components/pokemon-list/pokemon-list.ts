import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PokemonDetailPage } from '../../pages/pokemon-detail/pokemon-detail';
import { CapitalizePipe } from '../../pipes/capitalize/capitalize'

/**
 * Generated class for the PokemonListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pokemon-list',
  templateUrl: 'pokemon-list.html'
})
export class PokemonListComponent {
  @Input() pokemon: any[];

  constructor(private navCtrl: NavController) {
  }

  public ShowPokemon(pokemonName: string){
    console.log(`show ${pokemonName}`);
    this.navCtrl.push(PokemonDetailPage, { name: pokemonName });
  }
}
