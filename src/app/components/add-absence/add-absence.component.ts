import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

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

export class Absence {
  constructor(
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
    public IsAuthentic?: boolean,
    public IconId?: string,
    public IsCalculated?: boolean,
    public Status?: number,
    public ApprovalRequest?: string,
    public PartialTimeFrom?: string,
    public PartialTimeTo?: string,
    public PartialTimeDuration?: number,
    public IsPartial?: boolean,
    public OverrideHolidayAbsence?: boolean,
    public IsModified?: boolean,
    public ModifiedBuyer?: string,
    public ModifiedOn?: string,
  ) {

  }
}

@Component({
  selector: 'app-add-absence',
  templateUrl: './add-absence.component.html',
  styleUrls: ['./add-absence.component.css']
})
export class AddAbsenceComponent implements OnInit {
  user_data: any;
  absenceDef: AbsenceDefinitions[] = [];
  token: string = '';
  comment: string = '';

  constructor(
    private shared: SharedService,
    private httpClient: HttpClient,
  ) { }

  ngOnInit(): void {
    this.user_data = this.shared.getMessage();
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
          // this.getAbsences(extract_token);
          this.getAbsenceDefinitions(extract_token);
        }
      );
  }

  getAbsenceDefinitions(extract_token: string) {
    this.httpClient.get<any>('https://api4.allhours.com/api/v1/AbsenceDefinitions',
      { headers: new HttpHeaders({ 'authorization': 'Bearer ' + extract_token, 'content-type': 'application/json' }) }).subscribe(
        response => {
          (err: any) => console.log(err);
          this.absenceDef = response;
          //console.log(JSON.stringify(this.absenceDef));
        }
      );
  }

  getSelectedAbsence(selectedItem: any) {
    let timestamp = new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString();

    var absence = new Absence(this.user_data.Id, this.user_data.FirstName, "",
      this.user_data.LastName, timestamp, selectedItem.Id, selectedItem.Name, timestamp,
      0, "TimeClock", this.comment);
    this.user_data = absence;
  }

  addAbsence(data: any, ext_token: string) {
    this.httpClient.post('https://api4.allhours.com/api/v1/Absences', data,
      { headers: new HttpHeaders({ 'authorization': 'Bearer ' + ext_token, 'content-type': 'application/json' }) })
      .subscribe((result) => {
        //console.log('result ', result)
      })
  }

  onSubmit(comment: string) {
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
          this.user_data.Comment = comment;
          this.addAbsence(this.user_data, extract_token)
        }
      );
  }
}


