import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PokemonlocationProvider } from '../../providers/pokemonlocation/pokemonlocation';
import { PokemonOnLocation } from '../../components/pokemon-on-location/pokemon-on-location';
import { PokemonCaughtProvider } from '../../providers/pokemon-caught/pokemon-caught';
//native
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Vibration } from '@ionic-native/vibration';

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

  constructor(public navCtrl: NavController,
    private geolocation: Geolocation,
    private socialSharing: SocialSharing,
    private androidPermissions: AndroidPermissions,
    private vibration: Vibration,
    private pokemonLocationProvider: PokemonlocationProvider,
    private pokemonCaughtProvider: PokemonCaughtProvider,
    ) {
    this.latitude = 0;
    this.longitude = 0;

    this.catchMessage = "Too far away to catch pokemon";
    this.pokemonOnLocations = [];
    this.watchLocation();
    this.newPokemon();
  }

  private watchLocation(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
      .then(result => this.geolocation.watchPosition({ timeout: 30000, enableHighAccuracy: true }))
      .then(subs => subs.subscribe(data => {
        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;
        this.newPokemon();
        this.calculateDistance();
      })).catch(error => console.log(error.message));
  }

  public foundPokemon(name: string) {
    this.socialSharing.canShareVia("whatsapp")
    .then(data => this.socialSharing.shareViaWhatsApp(`I found ${name}!!`))
    .catch(err => console.log(`Cant share via Whatsapp ${err.message}`));
  }

  public calculateDistance(){
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
    if(this.latitude != undefined && this.longitude != undefined && this.pokemonOnLocations.length == 0){
      this.pokemonLocationProvider.initRandomPokemon(this.latitude, this.longitude);
      this.pokemonOnLocations = this.pokemonLocationProvider.getPokemon();
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
    //this.FoundPokemon(this.closestPokemon.name);

    this.removePokemon(this.closestPokemon);
    this.calculateDistance();
  }
}
