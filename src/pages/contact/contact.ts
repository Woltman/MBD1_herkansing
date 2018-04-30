import { Component } from '@angular/core';
import { NavController, AlertController  } from 'ionic-angular';
import { PokemonlocationProvider } from '../../providers/pokemonlocation/pokemonlocation';
import { PokemonOnLocation } from '../../components/pokemon-on-location/pokemon-on-location';
import { PokemonCaughtProvider } from '../../providers/pokemon-caught/pokemon-caught';
//native
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Vibration } from '@ionic-native/vibration';
import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  latitude: number;
  longitude: number;
  result: string;
  pokemonOnLocations: PokemonOnLocation[];
  distance: number;
  closestPokemon: PokemonOnLocation;
  catchMessage: string;
  canCatch = false;

  showShareAlert: boolean = true;

  gettingPokemon: boolean = false;
  isCatching: boolean = false;

  constructor(public navCtrl: NavController,
    private geolocation: Geolocation,
    private socialSharing: SocialSharing,
    private diagnostic: Diagnostic,
    private vibration: Vibration,
    private pokemonLocationProvider: PokemonlocationProvider,
    private pokemonCaughtProvider: PokemonCaughtProvider,
    private alertCtrl: AlertController
    ) {

    this.catchMessage = "Too far away to catch pokemon";
    this.watchLocation();
  }

  private watchLocation(){
    return this.diagnostic.isLocationAuthorized()
      .then(result => this.geolocation.watchPosition({ timeout: 30000, enableHighAccuracy: true }))
      .then(subs => subs.subscribe(data => {
        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;

        if(!this.gettingPokemon){
            this.newPokemon().then(result => this.calculateDistance());
        }
      }))
      .catch(error => console.log(error.message));
  }

  public foundPokemon(pokemon: any) {
    this.socialSharing.shareViaWhatsApp(`I caught ${pokemon.name}!!`, `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`)
    .catch(err => console.log(`Cant share via Whatsapp ${err.message}`));
  }

  public calculateDistance(){
    if(!this.pokemonOnLocations) return;

    this.closestPokemon = undefined;
    let dist = 99999;
    if(this.pokemonOnLocations.length > 0){
      for(var i = 0; i < this.pokemonOnLocations.length; i++){
        var pokedist = this.pokemonLocationProvider.distance(this.latitude, this.longitude, this.pokemonOnLocations[i].latitude, this.pokemonOnLocations[i].longitude);
        if(pokedist < dist){
          dist = pokedist;
          this.closestPokemon = this.pokemonOnLocations[i];
        }
      }
      this.distance = dist;
    }

    if(this.distance < 10){
      this.catchMessage = "You can catch this pokemon!!";
      this.canCatch = true;
      if(!this.isCatching){
        this.catch();
      }
    }
    else{
      this.catchMessage = "Too far away to catch this pokemon";
      this.canCatch = false;
    }
  }

  public newPokemon(){
    if(this.latitude != undefined && this.longitude != undefined && !this.pokemonOnLocations){
      this.gettingPokemon = true;
      return this.pokemonLocationProvider.initRandomPokemon(this.latitude, this.longitude).then(data => {
        this.pokemonOnLocations = this.pokemonLocationProvider.getPokemon();
        this.gettingPokemon = false;
      })
    }
    else{
      return Promise.resolve();
    }
  }

  public Vibrate() {
    this.vibration.vibrate(1000);
  }

  public removePokemon(pokemon: PokemonOnLocation){
    var index = this.pokemonOnLocations.indexOf(pokemon);
    this.pokemonOnLocations.splice(index, 1);
  }

  public catch(){
    this.isCatching = true;
    this.vibration.vibrate(500);
    this.catchMessage = "You did it!";
    this.canCatch = false;

    this.pokemonCaughtProvider.catch(this.closestPokemon.data);
    this.showAlert(this.closestPokemon.data);

    this.removePokemon(this.closestPokemon);
    if(this.pokemonOnLocations.length == 0){
      this.pokemonOnLocations = undefined;
    }
  }

  showAlert(pokemon:any){
    let alert = this.alertCtrl.create({
      title: `Catch!`,
      subTitle: `You caught ${pokemon.name}`,
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            this.showConfirm(pokemon);
          }
        },
      ]
    });
    alert.present();
  }

  showConfirm(pokemon: any) {
    if(!this.showShareAlert) {
      this.isCatching = false;
      return;
    } 

    let confirm = this.alertCtrl.create({
      title: `${pokemon.name}`,
      message: `You caught a Pokemon!`,
      inputs: [
        {
          value: 'dontshow',
          type: "checkbox",
          label: `Don't show again`,
          checked: false,
        }
      ],
      buttons: [
        {
          text: 'Continue',
          role: 'cancel',
          handler: data => {
            console.log('Cancelled');
            console.log(data);
            this.isCatching = false;
            this.showShareAlert = data.length == 0;
          }
        },
        {
          text: 'Share on WhatsApp',
          handler: data => {
            console.log('Shared');
            this.foundPokemon(pokemon);
            this.isCatching = false;
          }
        }
      ]
    });
    confirm.present();
  }
}
