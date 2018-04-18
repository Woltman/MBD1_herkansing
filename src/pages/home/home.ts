import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { PokemonServiceProvider } from '../../providers/pokemon-service/pokemon-service'
import { PokemonDetailPage } from '../pokemon-detail/pokemon-detail';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  pokemon:any[];
  nextPage: string;

  constructor(public navCtrl: NavController, private pokemonService: PokemonServiceProvider, private loadingCtrl: LoadingController, private geolocation: Geolocation) {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log("latitude "+resp.coords.latitude)
      console.log("longitude "+resp.coords.longitude)
     }).catch((error) => {
       console.log('Error getting location', error);
     });

     let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        console.log("latitude "+data.coords.latitude)
        console.log("longitude "+data.coords.longitude)
      });
    
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

  public ShowPokemon(pokemonName: string){
    console.log(`show ${pokemonName}`);
    this.navCtrl.push(PokemonDetailPage, { name: pokemonName });
  }
}
