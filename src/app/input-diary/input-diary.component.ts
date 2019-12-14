import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../shared/classes/user';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Diary } from '../shared/classes/diary';
import swal from 'sweetalert';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-input-diary',
  templateUrl: './input-diary.component.html',
  styleUrls: ['./input-diary.component.css', '../newsprint/newsprict.css']
})
export class InputDiaryComponent implements OnInit {
  currentUid: string;
  now = new Date();
  diary = new Diary();
  diaryRef: AngularFirestoreDocument<Array<Diary>>;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (!!user) {
        this.diaryRef = this.afs.doc(`users/${user.uid}`);
      } else {
        swal({
          text: 'Twitterによるログインが必要です',
          icon: 'warning'
        });
      }
      // this.diaryRef.doc;
      // this.diary = new Diary(user.uid);
    });
  }

  inputText() {
  }

  onClickSaveButton() {
    this.diary.createdAt = formatDate(this.now, 'yyyy/MM/dd/hh:ss', this.locale);
    this.auth.user$.subscribe(user => {
      this.diaryRef.collection('diaries').add(Object.assign({}, this.diary)).then(value => {
        console.log(`this.diaryRef.collection('diaries').add(Object.assign({}, this.diary)).then`);
        if (this.diary.text === '') {
          return;
        }
        swal({
          text: '日記を保存しました！',
          icon: 'success',
        }).then(() => {
          user.latestDiaryId = value.id;
          this.afs.doc(`users/${user.uid}`).update(user);
          this.diary.text = '';
        });
      },
      reason => {
        swal({
          text: 'エラーが発生しました！' + reason.toString(),
          icon: 'error',
        });
      });
    });
  }
}
