import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-input-diary',
  templateUrl: './input-diary.component.html',
  styleUrls: ['./input-diary.component.css', '../newsprint/newsprict.css']
})
export class InputDiaryComponent implements OnInit {
  text = '';
  disabled = !this.auth.user$;
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
  inputText() {

  }
}
