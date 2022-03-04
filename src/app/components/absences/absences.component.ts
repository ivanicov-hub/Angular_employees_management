import { Component, NgModule, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    public comment: string,
    public catDefinitionName?: string,
    public integrationId?: number,
    public code?: number,
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
  absence_users_index: number = 0;
  is_date_valid: boolean = true;

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
          (err: any) => console.log(err);
          this.absenceDef = response;
        }
      );
  }

  findAbsenceByDate(date: string) {
    if (this.isValidDate(date)) {
      this.is_date_valid = true;
      this.absence_users.splice(0, this.absence_users.length);
      this.absence_users_index = 0;

      this.absences.forEach(element => {
        var split_date = element.Timestamp.split('T', 1);
        var str_date = split_date.toString();
        if (str_date === date) {
          var absence_data = new AbsenceUserInfo(element.FirstName, element.LastName,
            str_date, element.AbsenceDefinitionId, element.Comment);
          this.absence_users.push(absence_data);
          this.getAbsenceDefinitionInfo(element.AbsenceDefinitionId, this.absence_users_index);
          this.absence_users_index++;
        }
      });
    }
    else {
      this.is_date_valid = false;
      this.absence_users.splice(0, this.absence_users.length);
      this.absence_users_index = 0;
    }
  }
  //2022-02-18
  getAbsenceDefinitionInfo(absence_id: string, index: number) {
    this.absenceDef.forEach(element => {
      if (element.Id === absence_id) {
        console.log(element.CategoryDefinitionName);
        this.absence_users[index].catDefinitionName = element.CategoryDefinitionName;
        this.absence_users[index].integrationId = element.IntegrationId;
        this.absence_users[index].code = element.Code;
      }
    });
  }

  isValidDate(dateString: string) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
  }
}
