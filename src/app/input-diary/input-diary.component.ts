import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-diary',
  templateUrl: './input-diary.component.html',
  styleUrls: ['./input-diary.component.css', '../newsprint/newsprict.css']
})
export class InputDiaryComponent implements OnInit {
  text = '';
  inputText() {

  }
  constructor() { }

  ngOnInit() {
  }

}
