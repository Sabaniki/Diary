import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {User} from '../../shared/classes/user';
import { Diary } from 'src/app/shared/classes/diary';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
      this.user$ = this.afAuth.authState.pipe(
        switchMap((user: User) => {
          // Logged in
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
      );
  }

  async twitterSignin() {
    const provider = new auth.TwitterAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    (credential.user as User).twitterID = credential.additionalUserInfo.username;
    // if ((credential.user as User).diaries === undefined) { (credential.user as User).diaries = new Array<Diary>(); }
    console.log(credential.user);
    return this.updateUserData(credential.user as User);
  }

  private updateUserData(user: User) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      twitterID: user.twitterID,
      // diaries: user.diaries
    };
    return userRef.set(data, { merge: true });
  }

  async signOut() {
      await this.afAuth.auth.signOut();
      this.router.navigate(['/']);
  }
}
