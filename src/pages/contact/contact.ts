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

  constructor(public navCtrl: NavController,
    private geolocation: Geolocation,
    private socialSharing: SocialSharing,
    private diagnostic: Diagnostic,
    private vibration: Vibration,
    private pokemonLocationProvider: PokemonlocationProvider,
    private pokemonCaughtProvider: PokemonCaughtProvider,
    private alertCtrl: AlertController
    ) {
    this.latitude = 0;
    this.longitude = 0;

    this.catchMessage = "Too far away to catch pokemon";
    //this.pokemonOnLocations = [];
    this.watchLocation();
    this.newPokemon().then(data => this.calculateDistance());
  }

  private watchLocation(){
    this.diagnostic.isLocationAuthorized()
      .then(result => this.geolocation.watchPosition({ timeout: 30000, enableHighAccuracy: true }))
      .then(subs => subs.subscribe(data => {
        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;
        this.newPokemon().then(data => this.calculateDistance());
      })).catch(error => console.log(error.message));
  }

  public foundPokemon(name: string) {
    this.socialSharing.canShareVia("whatsapp")
    .then(data => this.socialSharing.shareViaWhatsApp(`I found ${name}!!`))
    .catch(err => console.log(`Cant share via Whatsapp ${err.message}`));
  }

  public calculateDistance(){
    if(!this.pokemonOnLocations) return;

    this.closestPokemon = undefined;
    let dist = 99999;
    if(this.pokemonOnLocations.length > 0){
      for(var i = 0; i < this.pokemonOnLocations.length-1; i++){
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
    }
    else{
      this.catchMessage = "Too far away to catch this pokemon";
      this.canCatch = false;
    }
  }

  public newPokemon(){
    if(this.latitude != undefined && this.longitude != undefined && !this.pokemonOnLocations){
      return this.pokemonLocationProvider.initRandomPokemon(this.latitude, this.longitude).then(data => {
        this.pokemonOnLocations = this.pokemonLocationProvider.getPokemon();
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
    this.catchMessage = "You did it!";
    this.canCatch = false;

    this.pokemonCaughtProvider.catch(this.closestPokemon.data);
    this.showConfirm(this.closestPokemon.data.name);

    this.removePokemon(this.closestPokemon);
    this.calculateDistance();
  }

  showConfirm(name: string) {
    if(!this.showShareAlert) return;

    let confirm = this.alertCtrl.create({
      title: `${name}`,
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
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancelled');
            console.log(data);
            this.showShareAlert = data.length == 0;
          }
        },
        {
          text: 'Share on WhatsApp',
          handler: data => {
            console.log('Shared');
            this.foundPokemon(name);
          }
        }
      ]
    });
    confirm.present();
  }
}
