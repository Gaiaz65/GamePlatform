import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}

let appInnit = false

firebase.initializeApp(environment.firebase)
firebase.auth().onAuthStateChanged(() => {
  if (!appInnit){
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  }
  appInnit = true
})

