import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { FinancialAndLegalServiceService } from '../financial-and-legal-service.service';
import { ApiHelperService } from '../services/api-helper.service';

@Component({
  selector: 'app-association-list',
  templateUrl: './association-list.component.html',
  styleUrls: ['./association-list.component.css']
})
export class AssociationListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'dateOfCreation', 'members'];
  dataSource : Object[] = [];
  wantToAddOrSuppr : boolean = false;
  addF: boolean = false;
  processVerbal : boolean = false;
  supprF: boolean = false;

  users !: String[]

  // Parti sur l'association
  role !: string[];
  name !: string;
  associationFormId !: number;

  // Parti sur le procès verbal
  verballProcessId !: number;
  idVoters !: number[];
  content !: string;
  date !: string;


  ajoutAssociation = new FormGroup({
    roleControl: new FormControl(),
    nameControl: new FormControl()
  })

  ajoutProcesVerbal = new FormGroup({
    controlContent: new FormControl(),
    controlDate: new FormControl(),
    controlIdVoters : new FormControl()
  })
  
  constructor(
    private http: HttpClient,
    private api : ApiHelperService,
    private financialAndLegalServiceService : FinancialAndLegalServiceService
  ) { }

  /**
   * Permet de récupérer les données liées au lien passée en paramètre
   * @param link le lien sur lequel on veut appliquer la requête
   * @returns un observable sur cette requête
   */
  sendGetRequest(link : string): Observable<any> {
    return this.http.get<any>(link);
  }

  sendPostRequest(link : string, data: any): Observable<any> {
    return this.http.post<any>(link, data);
  }

  ngOnInit(): void {
    this.sendGetRequest('http://localhost:3000/associations').subscribe(
      res => {
        let test = []
        for(let i = 0; i < res.length; i++){
          let object = res[i]
          let members = object['members']
          let membersToString : String[] = []
          for(let j= 0; j < members.length; j++){
            let member = members[j]
            let memberToString = " Lastname : " + member['lastname'] + ", Firstname : " + member['firstname'] + ", Age : " + member['age'] + ", Role : " + member['role']
            membersToString.push(memberToString)
          }
          let newResult = {name:object['name'],dateOfCreation:object['dateOfCreation'],members:membersToString}
          test.push(newResult);
        }
        this.dataSource = test;
      }
    );

      this.ajoutProcesVerbal.get('controlContent')?.valueChanges.subscribe(res => {
        this.content = res.toString();
      });
      this.ajoutProcesVerbal.get('controlDate')?.valueChanges.subscribe(res => {
        this.date = res.toString();
      });
      this.ajoutProcesVerbal.get('controlIdVoters')?.valueChanges.subscribe(res => {
         let test = [];
        for (let i = 0; i < res.length; i++){
          test.push( Number(res[i]));
        }
        this.idVoters = test
      });
      this.ajoutAssociation.get('roleControl')?.valueChanges.subscribe(res => {
        this.role = res.toString().split(" ");
      });
      this.ajoutAssociation.get('nameControl')?.valueChanges.subscribe(res => {
        this.name = res.toString();
      });
      // On récupère tout les users

      this.sendGetRequest('http://localhost:3000/users').subscribe(res => {
        let test = []
        for(let i=0; i <res.length; i++) {
          let el = res[i]
          let userTopush = el['id'].toString()
          test.push(userTopush);
        }
        this.users = test
      });
  }


cango = false

  submitProcessVerbal(){
    this.addF = false;
    this.processVerbal = true;
    this.supprF = false;
    this.financialAndLegalServiceService.getVerbalProcessId(this.idVoters, this.content, this.date).subscribe(
      res => {
        this.financialAndLegalServiceService.createAssociationForm().subscribe(res =>{
          this.associationFormId = res['id'];
          console.log("id AssociationForm :")
          console.log(this.associationFormId)
          this.verballProcessId = (Number)(res['id']);
          this.financialAndLegalServiceService.validateFinancialy(this.associationFormId).subscribe(res =>{
            console.log("financial validation")
            console.log(res);
            this.financialAndLegalServiceService.validateLegaly(this.associationFormId).subscribe(res => {
              console.log("legal validation")
              console.log(res);
              console.log(this.verballProcessId);
              this.cango =true;
            });
          } );
        });
      }
    );
  }

  submit(){
    while (!this.cango) {}
    let data = {name : this.name, idUsers : this.idVoters, roles : this.role, associationFormId : this.associationFormId, verbalProcessId : this.verballProcessId}
    this.sendPostRequest('http://localhost:3000/associations/', data).subscribe(res =>{
      console.log(res);
      this.ngOnInit();
    });
    window.location.reload(); 
  }

  add(){
    this.addF = true;
    this.processVerbal = false;
    this.supprF = false;
  }

  suppr(){
    this.addF = false;
    this.processVerbal = false;
    this.supprF = true;
  }

  update(){

  }

}
