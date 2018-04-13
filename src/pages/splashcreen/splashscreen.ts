import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FacebookService } from '../../providers/facebook-service';
import { MainPage } from '../pages';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-splashscreen',
  templateUrl: 'splashscreen.html'
})
export class SplashscreenPage {

  constructor(public navCtrl: NavController, private facebook:FacebookService) {}

  ngAfterViewInit() {
    let _self = this;
    setTimeout(function(){
      _self.facebook.getStatus().subscribe((connected) => {
        if(connected){
          _self.navCtrl.push(MainPage);
        }else{
          _self.navCtrl.push('LoginPage');
        }
      })
    }, 1000);
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
}
