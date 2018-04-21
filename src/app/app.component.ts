import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OnDestroy } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnDestroy {
  rootPage:any = TabsPage;
  

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen, 
              private diagnostic: Diagnostic) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      diagnostic.requestLocationAuthorization(diagnostic.permission.ACCESS_FINE_LOCATION).then(
        result => console.log("permission granted"),
        error => console.log("no permission"),
      )

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnDestroy(){
    console.log("On destroy called in appcomponent");
  }
}
