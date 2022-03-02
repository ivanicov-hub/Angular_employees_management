import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


export class User {
  constructor(
    public id: string,
    public FirstName: string,
    public LastName: string,
    public MiddleName: string,
    public BirthDate: Date,
    public Address: string,
    public City: string,
    public State: string,
    public Phone: string,
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
  constructor(
    private httpClient: HttpClient
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
          //console.log(JSON.stringify(extract_token) + ' MADONA');
          (err: any) => console.log(err);
          this.token = extract_token;
          this.getUsers(extract_token);
        }
      );
  }

  getUsers(token: string) {
    //console.log(JSON.stringify(this.token).toString() + 'getUsers')
    //let token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE5MDgwRUVFNTM0RjBBREE1RjlGMzhBNEQwRjlERTYzMjU1OTI3OTlSUzI1NiIsInR5cCI6IkpXVCIsIng1dCI6IkdRZ083bE5QQ3RwZm56aWswUG5lWXlWWko1ayJ9.eyJuYmYiOjE2NDYxNzQ5NTQsImV4cCI6MTY0NjE3ODU1NCwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5hbGxob3Vycy5jb20iLCJhdWQiOiJhcGkiLCJjbGllbnRfaWQiOiJnTmEwckdFa0ZZY0JyVThxQWV2ekN6UFplIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInRlbmFudF9pZCI6IjhlMTMyNzNkLWMyM2MtNDBmMS04MWYzLTA4ZDlmMGFkNzlhNiIsImp0aSI6IjAwMjRDNDcyMENEOUI3OERGOUI4NDFDRkQ2NDgzRkMzIiwiaWF0IjoxNjQ2MTc0OTU0LCJzY29wZSI6WyJhcGkiXX0.Mb34Qv7-uP3xjasdBdRxJ04TF_gzVM_tyUOvbLcrSuuXwtKuSfAvYyw1R-oJkl6g-KnzDwT0Z6V97nAGY4EnqlL33Qwui37cL3MWNg9n-Zd8xRinsOw6MMi28-_buG35b7TF2TZqWFF6jPdwoy-pmFaFEGcM57GedvFKsY6BQjR0ABkGIHTGP4KadGix9l_SMZW_Q1bf5CSxTCpry1RwfoNGrExcfAwgwZSZlvsH-nL5eTQvPOcr0rqjzphOU9lylzL4xQt4v9NZ928mEaclnPIeUjhcRZy8YN9-BlyQzWCTjkkkOArgYUIeEBpFJ7dWUxfIv-f6IF4JoXcJMABTHA";
    this.httpClient.get<any>('https://api4.allhours.com/api/v1/Users',
      { headers: new HttpHeaders({ 'authorization': 'Bearer ' + token, 'content-type': 'application/json' }) }).subscribe(
        response => {
          console.log(response);
          (err: any) => console.log(err);
          this.users = response;
        }
      );
  }
}
