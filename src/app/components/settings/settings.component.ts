import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  CLIENT_ID: string = "gNa0rGEkFYcBrU8qAevzCzPZe";
  CLIENT_SECRET: string = "ia1QN38I0TMMX1BdZ3yKhSVswtXCzxqP5UTNpgOzlxJBvCui5z"

  setAuthData() {
    localStorage.setItem("CLIENT_ID", this.CLIENT_ID);
    localStorage.setItem("CLIENT_SECRET", this.CLIENT_SECRET);
  }

  ngOnInit(): void {
    this.setAuthData();
  }

}
