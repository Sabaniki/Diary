import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDiaryComponent } from './input-diary.component';

describe('InputDiaryComponent', () => {
  let component: InputDiaryComponent;
  let fixture: ComponentFixture<InputDiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
