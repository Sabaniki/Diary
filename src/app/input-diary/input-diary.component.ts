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
  now: Date;
  diary: Diary;
  diaryRef: AngularFirestoreDocument<Array<Diary>>;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit() {
    this.now = new Date();
    this.diary = new Diary();
    this.auth.user$.subscribe(user => {
      if (!!user) {
        this.diaryRef = this.afs.doc(`users/${user.uid}`);
      } else {
        swal({
          text: 'Twitterによるログインが必要です',
          icon: 'warning'
        });
      }
      if (!!user.latestDiaryCreatedAt && user.latestDiaryCreatedAt === formatDate(this.now, 'yyyy-MM-dd', this.locale)) {
        this.diaryRef.collection('diaries').doc(user.latestDiaryCreatedAt).get().subscribe(doc => this.diary = doc.data());
      }
    });
  }

  inputText() {
  }

  onClickSaveButton() {
    this.diary.createdAt = formatDate(this.now, 'yyyy-MM-dd', this.locale);
    this.diaryRef.collection('diaries').doc(this.diary.createdAt).set(Object.assign({}, this.diary)).then(() => {
      swal({
        text: '日記を保存しました！',
        icon: 'success',
      }).then(() => {
        this.auth.user$.subscribe(user => {
          user.latestDiaryCreatedAt = this.diary.createdAt;
          this.afs.doc(`users/${user.uid}`).update(user);
        });
        this.diary.text = '';
      });
    },
    reason => {
      swal({
        text: 'エラーが発生しました！' + reason.toString(),
        icon: 'error',
      });
    });
  }
}
