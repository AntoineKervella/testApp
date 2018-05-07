// src/providers/facebook-service.ts

import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import AuthProvider = firebase.auth.AuthProvider;
import { Observable } from 'rxjs/Observable';
import { Facebook } from "@ionic-native/facebook";

@Injectable()
export class FacebookService {

  session: any;

  constructor (public facebook: Facebook, public afAuth: AngularFireAuth) {}

  login(){
    return Observable.create(observer => {
      this.facebook.login(['public_profile', 'user_friends', 'email']).then((response) => {
        if (response.status === "connected") {
          const facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(response.authResponse.accessToken);

          firebase.auth().signInWithCredential(facebookCredential)
            .then( success => {
              console.log("Firebase success: " + JSON.stringify(success));
            });

          this.session = response;
          observer.next(true);        //On retourne true ou false qui correspond au statut de la connexion
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      }, (error) => {
        console.log(error);
      });
    });
  }

  logout(){
    return Observable.create(observer => {
      observer.next(this.afAuth.auth.signOut());        //On retourne true ou false qui correspond au statut de la connexion
      observer.complete();
    });
  }

  getStatus(){
    return Observable.create(observer => {
      this.afAuth.authState
        .subscribe(
          user => {
            if (user) {
              this.session = user;
              localStorage.setItem('user', JSON.stringify(user));
              observer.next(user);
              observer.complete();
            } else {
              observer.next(false);
              observer.complete();
            }
          },
          () => {
            observer.next(false);
            observer.complete();
          }
        );
    })
  }

  getProfile(){ // Nouvelle fonction qui retourne un Observable avec les informations de profil
    return Observable.create(observer => {
      if(this.session.status === "connected"){
        this.facebook.api("/me?fields=name,picture", ["public_profile"]).then((response)=>{
          console.log(response);
          observer.next(response);    //On retourne la réponse Facebook avec les champs name et picture
          observer.complete();
        },(error) => {
          console.log(error) });
      } else {
        observer.next(undefined);
        observer.complete();
      }
    });
  }

  //Google Auth
  signInWithGoogle() {
    console.log('Sign in with google');
    return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
  }

  private oauthSignIn(provider: AuthProvider) {
    if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider);
    } else {
      return this.afAuth.auth.signInWithRedirect(provider)
        .then(() => {
          return this.afAuth.auth.getRedirectResult().then( result => {
            // This gives you a Google Access Token.
            // You can use it to access the Google API.
            let token = result.credential.accessToken;
            // The signed-in user info.
            let user = result.user;
            user.gatoken = token;
            this.session = user;
          }).catch(function(error) {
            // Handle Errors here.
            alert(error.message);
          });
        });
    }
  }
}
