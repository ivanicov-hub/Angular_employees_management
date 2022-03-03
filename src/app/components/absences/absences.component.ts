import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../users/users.component';
import { elementAt } from 'rxjs';

export class Absence {
  constructor(
    public id: string,
    public UserId: string,
    public FirstName: string,
    public MiddleName: string,
    public LastName: string,
    public Timestamp: string,
    public AbsenceDefinitionId: string,
    public AbsenceDefinitionName: string,
    public InsertedOn: string,
    public Origin: number,
    public OriginDisplayName: string,
    public Comment: string,
    public IsAuthentic: boolean,
    public IconId: string,
    public IsCalculated: boolean,
    public Status: number,
    public ApprovalRequest: string,
    public PartialTimeFrom: string,
    public PartialTimeTo: string,
    public PartialTimeDuration: number,
    public IsPartial: boolean,
    public OverrideHolidayAbsence: boolean,
    public IsModified: boolean,
    public ModifiedBuyer: string,
    public ModifiedOn: string,
  ) {

  }
}

export class AbsenceDefinitions {
  constructor(
    public Id: string,
    public Name: string,
    public IntegrationId: number,
    public Code: number,
    public Type: number,
    public IsAvailableForAdminsOnly: boolean,
    public CategoryDefinitionId: string,
    public CategoryDefinitionName: string,
    public Fraction: number
  ) {

  }
}

export class AbsenceUserInfo {
  constructor(
    public name: string,
    public surname: string,
    public date: string,
    public absDefinitionsId: string,
    //public catDefinitionName?: string,
  ) {

  }
}



@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.css']
})
export class AbsencesComponent implements OnInit {

  absences: Absence[] = [];
  absenceDef: AbsenceDefinitions[] = [];
  token: string = '';
  absence_users: AbsenceUserInfo[] = [];
  //absence_info: AbsenceInformation[] = [];

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
          (err: any) => console.log(err);
          this.token = extract_token;
          this.getAbsences(extract_token);
          this.getAbsenceDefinitions(extract_token);
        }
      );
  }

  getAbsences(extract_token: string) {
    this.httpClient.get<any>('https://api4.allhours.com/api/v1/Absences',
      { headers: new HttpHeaders({ 'authorization': 'Bearer ' + extract_token, 'content-type': 'application/json' }) }).subscribe(
        response => {
          console.log(response);
          (err: any) => console.log(err);
          this.absences = response;
          console.log(JSON.stringify(this.absences) + 'madona')
        }
      );
  }

  getAbsenceDefinitions(extract_token: string) {
    this.httpClient.get<any>('https://api4.allhours.com/api/v1/AbsenceDefinitions',
      { headers: new HttpHeaders({ 'authorization': 'Bearer ' + extract_token, 'content-type': 'application/json' }) }).subscribe(
        response => {
          console.log(response);
          (err: any) => console.log(err);
          this.absenceDef = response;
          console.log(JSON.stringify(this.absenceDef) + 'madona')
        }
      );
  }

  findAbsenceByDate(date: string) {
    //console.log(JSON.stringify(this.absences));
    this.absences.forEach(element => {
      var split_date = element.Timestamp.split('T', 1);
      var str_date = split_date.toString();
      if (str_date === date) {
        //console.log(element.FirstName + ' ' + element.LastName);
        var absence_data = new AbsenceUserInfo(element.FirstName, element.LastName, str_date, element.AbsenceDefinitionId);
        this.absence_users.push(absence_data);
        console.log(this.absence_users);
        this.getAbsenceDefinitionInfo(element.AbsenceDefinitionId);
      }
    });

  }
  //2022-02-18
  getAbsenceDefinitionInfo(absence_id: string) {
    this.absenceDef.forEach(element => {
      if (element.Id === absence_id) {
        console.log(element.CategoryDefinitionName);
        //var absence = new AbsenceInformation(element.)
      }
    });
  }
}
