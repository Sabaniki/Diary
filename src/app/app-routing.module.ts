import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InputDiaryComponent} from './input-diary/input-diary.component';



const routes: Routes = [
  { path: 'write', component:  InputDiaryComponent },
  { path: '', redirectTo: '/write', pathMatch: 'prefix' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
