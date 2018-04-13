import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SplashscreenPage } from './splashscreen';

@NgModule({
  declarations: [
    SplashscreenPage,
  ],
  imports: [
    IonicPageModule.forChild(SplashscreenPage),
    TranslateModule.forChild()
  ],
  exports: [
    SplashscreenPage
  ]
})
export class SplashscreenPageModule { }
