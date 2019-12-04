import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {User} from '../../shared/classes/user';

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
    return this.updateUserData(credential.user as User);
  }

  private updateUserData(user: User) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    return userRef.set(data, { merge: true });
  }

  async signOut() {
      await this.afAuth.auth.signOut();
      this.router.navigate(['/']);
  }
}
