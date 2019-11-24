import { Component } from '@angular/core';
import axios from 'axios';

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
    axios.post('https://yunus-finance.herokuapp.com/api/customers', {
      firstName: this.name.split(' ')[0],
      lastName: this.name.split(' ')[1],
      email: this.email,
      dateOfBirth: null,
      phoneNumberCountryCode: null,
      phoneNumber: this.phone,
      countryName: this.residence,
      nativeLanguage: this.nativeLanguage
    })
      .then((response) => {
        alert(response);
      })
      .catch((err) => {
        alert(err);
      })

  }


}
