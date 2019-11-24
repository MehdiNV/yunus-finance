import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  name:string;
  residence:string;
  summary:string;
  email:string;
  phone:string;
  nativeLanguage:string;

  constructor() {}

  applyLoan(){
    console.log(this.name + this.residence + this.summary)
  }


}
