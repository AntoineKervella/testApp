import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FacebookService } from '../../providers/facebook-service';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account = {};

  signin = true;
  signup = false;
  resetpw = false;

  @ViewChild('signin') signinElmt: ElementRef;
  @ViewChild('signinlink') signinLinkElmt: ElementRef;
  @ViewChild('signup') signupElmt: ElementRef;
  @ViewChild('signuplink') signupLinkElmt: ElementRef;
  @ViewChild('resetpw') resetpwElmt: ElementRef;
  @ViewChild('resetpwlink') resetpwLinkElmt: ElementRef;


  // Our translated text strings
  private loginErrorString: string;

  userProfile: any;
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public facebook: FacebookService) {
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  ngAfterViewInit() {
    this.signin = true;
  }

  ionViewWillEnter() {
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.transform = 'translateY(56px)';
      });
    } // end if
  }

  ionViewDidLeave() {
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.transform = 'translateY(0)';
      });
    } // end if
  }

  viewSignIn(){
    this.signupElmt.nativeElement.classList.add("hidden");
    this.resetpwElmt.nativeElement.classList.add("hidden");
    this.signinElmt.nativeElement.classList.remove("hidden");
    this.signinElmt.nativeElement.classList.add("animated", "fadeIn");
    this.signupLinkElmt.nativeElement.classList.add("hidden");
    this.signinLinkElmt.nativeElement.classList.remove("hidden");
    this.signinLinkElmt.nativeElement.classList.add("animated", "fadeIn");
  }
  viewSignUp(){
    this.signinElmt.nativeElement.classList.add("hidden");
    this.resetpwElmt.nativeElement.classList.add("hidden");
    this.signupElmt.nativeElement.classList.remove("hidden");
    this.signupElmt.nativeElement.classList.add("animated", "fadeIn");
    this.signinLinkElmt.nativeElement.classList.add("hidden");
    this.signupLinkElmt.nativeElement.classList.remove("hidden");
    this.signupLinkElmt.nativeElement.classList.add("animated", "fadeIn");
    // this.signin = false;
    // this.signup = true;
    // this.resetpw = false;
  }
  viewResetPw(){
    this.signinElmt.nativeElement.classList.add("hidden");
    this.signupElmt.nativeElement.classList.add("hidden");
    this.resetpwElmt.nativeElement.classList.remove("hidden");
    this.resetpwElmt.nativeElement.classList.add("animated", "fadeIn");
  }

  // Attempt to login in through our User service
  login() {
    console.log('testTEST');
    // this.user.login(this.account).subscribe((resp) => {
    //   this.navCtrl.push(MainPage);
    // }, (err) => {
    //   this.navCtrl.push(MainPage);
    //   // Unable to log in
    //   let toast = this.toastCtrl.create({
    //     message: this.loginErrorString,
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });
  }

  fbLogin() {
    this.facebook.getStatus().subscribe((connected =>{
      console.log(connected);
      if(!connected){
        this.facebook.login().subscribe((connected)=>{   //On surveille l'observable afin de récupérer le status de connection
          if(connected === true){
            this.facebook.getProfile().subscribe((profile)=>{   //Si connecté, on récupére le profil
              this.userProfile = profile;
              this.navCtrl.push(MainPage);
            }, (error)=>{console.log(error);});
          }
        }, (error)=>{console.log(error);});
      }else{
        this.facebook.getProfile().subscribe((profile)=>{   //Si connecté, on récupére le profil
          this.userProfile = profile;
          this.navCtrl.push(MainPage);
        }, (error)=>{console.log(error);});
      }
    }));
  }

  gglogin() {
    this.facebook.signInWithGoogle()
      .then(
        (connected) => {
          console.log(connected);
          if(connected){
            this.navCtrl.push(MainPage);
          }
        },
        error => console.log(error.message)
      );
  }
}
