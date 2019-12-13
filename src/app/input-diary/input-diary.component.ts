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
  diary = new Diary('');
  now = new Date();
  diaryRef: AngularFirestoreCollection<Diary>;
  constructor(private auth: AuthService, private afs: AngularFirestore, @Inject(LOCALE_ID) private locale: string) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.diaryRef = this.afs.collection('diaries');
      this.diary = new Diary(user.uid);
    });
  }

  inputText() {
  }

  onClickSaveButton() {
    this.diary.createdAt = formatDate(this.now,　'yyyy/MM/dd/HH:mm', this.locale);
    this.diaryRef.add(Object.assign({}, this.diary)).then(() => {
      swal({
        text: '日記を保存しました！',
        icon: 'success',
      });
      this.diary.text = '';
    });
  }
}
