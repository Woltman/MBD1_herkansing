import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private socialSharing: SocialSharing) {
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

      this.FoundPokemon("pikachu");
  }

  public FoundPokemon(name: string){
    this.socialSharing.shareViaWhatsApp(`I found ${name}!!`);
  }
}
