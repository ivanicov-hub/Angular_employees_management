import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

export class User {
  constructor(
    public id: string,
    public FirstName: string,
    public LastName: string,
    public MiddleName: string,
    public FullName: string,
    public BirthDate: Date,
    public Address: string,
    public City: string,
    public State: string,
    public Phone: string,
    public Mobile: string,
    public Email: string,
    public Gender: string,
    public PictureUri: string,
    public CustomId: number,
    public CustomField1: string,
    public CustomField2: string,
    public CustomField3: string,
    public CustomField4: string,
    public CustomField5: string,
    public CustomField6: string,
    public CustomField7: string,
    public CustomField8: string,
    public CustomField9: string,
    public CustomField10: string,
    public IsTimeAttendanceUser: boolean,
    public IsArchived: boolean,
    public HasUserAccount: boolean,
    public UserAccountId: string,
    public CalculationStartDate: Date,
    public CalculationStopDate: Date
  ) {

  }
}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

  users: User[] = [];
  token: string = '';
  searchValue: string = '';
  term: string = ' ';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private shared: SharedService,
  ) { }

  ngOnInit(): void {
    this.postAuthentication();
  }

  postAuthentication() {
    let body = new URLSearchParams();
    body.set('grant_type', "client_credentials");
    // @ts-ignore: Object is possibly 'null'
    body.set('client_id', localStorage.getItem("CLIENT_ID"));
    // @ts-ignore: Object is possibly 'null'
    body.set('client_secret', localStorage.getItem("CLIENT_SECRET"));
    body.set('scope', 'api');

    let extract_token = '';
    this.httpClient.post<any>('https://login.allhours.com/connect/token', body.toString(),
      { headers: new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded') }).subscribe(
        response => {
          extract_token = response["access_token"];
          (err: any) => console.log(err);
          this.token = extract_token;
          this.getUsers(extract_token);
        }
      );
  }

  getUsers(token: string) {
    //console.log(JSON.stringify(this.token).toString() + 'getUsers')
    this.httpClient.get<any>('https://api4.allhours.com/api/v1/Users',
      { headers: new HttpHeaders({ 'authorization': 'Bearer ' + token, 'content-type': 'application/json' }) }).subscribe(
        response => {
          console.log(response);
          (err: any) => console.log(err);
          this.users = response;
          console.log(JSON.stringify(this.users) + 'madona')
        }
      );
  }

  addUser(data: any, ext_token: string) {
    //console.log('token ' + ext_token);
    this.httpClient.post('https://api4.allhours.com/api/v1/Users', data,
      { headers: new HttpHeaders({ 'authorization': 'Bearer ' + this.token, 'content-type': 'application/json' }) })
      .subscribe((result) => {
        console.log('result ', result)
      })
  }


  onSubmit(data: any, ext_token: string) {
    let body = new URLSearchParams();
    body.set('grant_type', "client_credentials");
    // @ts-ignore: Object is possibly 'null'
    body.set('client_id', localStorage.getItem("CLIENT_ID"));
    // @ts-ignore: Object is possibly 'null'
    body.set('client_secret', localStorage.getItem("CLIENT_SECRET"));
    body.set('scope', 'api');

    let extract_token = '';
    this.httpClient.post<any>('https://login.allhours.com/connect/token', body.toString(),
      { headers: new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded') }).subscribe(
        response => {
          extract_token = response["access_token"];
          (err: any) => console.log(err);
          this.token = extract_token;
          this.addUser(data, extract_token)
        }
      );
  }

  getSelectedUser(selectedItem: any) {
    console.log("Selected user Id: ", selectedItem.Id);
    this.shared.setMessage(selectedItem);
    this.router.navigate(['add-absence'])
  }
}




