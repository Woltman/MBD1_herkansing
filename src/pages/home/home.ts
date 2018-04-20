import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { PokemonServiceProvider } from '../../providers/pokemon-service/pokemon-service'
import { PokemonDetailPage } from '../pokemon-detail/pokemon-detail';
import { CapitalizePipe } from '../../pipes/capitalize/capitalize'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  pokemon:any[];
  nextPage: string;

  constructor(public navCtrl: NavController, private pokemonService: PokemonServiceProvider, private loadingCtrl: LoadingController) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
    setTimeout(() => {
      this.GetPokemon();
    }, 500);
    loading.dismiss();
  }

  GetPokemon(){
    this.pokemonService.GetPokemon().subscribe(data => { 
      console.log(JSON.stringify(data.results));
      this.pokemon = data.results;
      this.nextPage = data.next; 
    }, error => { 
      console.log("error") 
    });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.pokemonService.Get(this.nextPage).subscribe(data => {
        console.log(JSON.stringify(data.results));
        data.results.forEach(element => {
          this.pokemon.push(element);
        });
        this.nextPage = data.next; 
      })

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }
}
