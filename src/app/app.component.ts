import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OnDestroy } from '@angular/core';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnDestroy {
  rootPage:any = TabsPage;
  

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen, 
              private androidPermissions: AndroidPermissions) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
        result => console.log("permission granted"),
        error => console.log("no permission"),
      );

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnDestroy(){
    console.log("On destroy called in appcomponent");
  }
}
