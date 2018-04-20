import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { PokemonOnLocation } from '../../components/pokemon-on-location/pokemon-on-location';

import { PokemonServiceProvider } from '../../providers/pokemon-service/pokemon-service';
/*
  Generated class for the PokemonlocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PokemonlocationProvider {
  pokemonOnLocation: PokemonOnLocation[];

  constructor(public http: HttpClient, private pokemonServiceProvider: PokemonServiceProvider) {
    console.log('Hello PokemonlocationProvider Provider');
    this.pokemonOnLocation = [];
  }

  public initRandomPokemon(latitude: number, longitude:number){
    this.pokemonOnLocation = [];
    for(var i = 0; i < 10; i++){
      let lat = this.getRandomFloat(0.00001,0.0001) + latitude;
      let long = this.getRandomFloat(0.00001, 0.0001) + longitude;
      
      let id = this.getRandomInt(1, 802);
      this.pokemonServiceProvider.GetPokemonById(id).subscribe(data => 
        { 
          this.pokemonOnLocation.push(new PokemonOnLocation(long, lat, data, id));
        }, error => { console.log(`error ${error.message}`) });
    }
  }

  public getPokemon(){
    return this.pokemonOnLocation;
  }

  public distance(lat1, lon1, lat2, lon2, unit?) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    else if (unit=="N") { dist = dist * 0.8684 }
    else dist = dist * 1609,34;
    return dist
  }

  private getRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private getRandomInt(min: number, max: number){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
