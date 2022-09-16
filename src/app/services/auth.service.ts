import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import IUser from '../model/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { delay } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { switchMap } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuth$: Observable<boolean>;
  public isAuthWithDelay$: Observable<boolean>;
  redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute) {
    this.usersCollection = db.collection('users');
    this.isAuth$ = auth.user.pipe(map((user) => !!user));
    this.isAuthWithDelay$ = this.isAuth$.pipe(delay(1000));

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e=> this.route.firstChild),
      switchMap(route=> route?.data ?? of({}))
    ).subscribe(data => {
      this.redirect = data['authOnly'] ?? false
    });
  }

  public async createUser(userData: IUser) {
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email as string,
      userData.password as string
    );

    if (!userCred.user) {
      throw new Error('User can not be found');
    }

    this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });

    await userCred.user.updateProfile({
      displayName: userData.name,
    });
  }

 public async logout(event?: Event) {
    if(event){
      event.preventDefault();
    }

    await this.auth.signOut();

    if(this.redirect){
    await this.router.navigateByUrl('/');
    }
  }
}
