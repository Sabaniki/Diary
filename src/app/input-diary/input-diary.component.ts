import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../shared/classes/user';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Diary } from '../shared/classes/diary';
import swal from 'sweetalert';

@Component({
  selector: 'app-input-diary',
  templateUrl: './input-diary.component.html',
  styleUrls: ['./input-diary.component.css', '../newsprint/newsprict.css']
})
export class InputDiaryComponent implements OnInit {
  diary = new Diary('');

  diaryRef: AngularFirestoreCollection<Diary>;
  constructor(private auth: AuthService, private afs: AngularFirestore) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.diaryRef = this.afs.collection('diaries');
      this.diary = new Diary(user.uid);
      console.log(this.diary.completedUsername);
    });
  }

  inputText() {
  }

  onClickSaveButton() {
    this.diaryRef.add(Object.assign({}, this.diary)).then(() => {
      swal({
        text: '日記を保存しました！',
        icon: 'success',
      });
      this.diary.text = '';
    });
  }
}
