import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-association',
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.css']
})
export class AssociationComponent implements OnInit {

  //Booleans
  modificationsOn !: boolean;
  delete !: boolean;
  role = [];

  displayedColumns: string[] = ['name', 'dateOfCreation', 'members'];
  dataSource : Object[] = [];
  name !: String;
  members !: String[];
  dateOfCreation !: String;

  idVoters !: number[];

  ajoutAssociation = new FormGroup({
    memberControl: new FormControl(),
    nameControl: new FormControl()
  })

  constructor(
    private route:ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modificationsOn = false;
    this.delete = false;
    this.route.paramMap.subscribe( (params: ParamMap) => { 
      console.log(params.get('name'));
      let name = params.get('name');
      if(name != undefined){
        this.name = name;
        this.getByName(name);
      }
    });
    this.ajoutAssociation.get('nameControl')?.valueChanges.subscribe(res => {
      this.name = res.toString();
    });
    this.ajoutAssociation.get('memberControl')?.valueChanges.subscribe(res => {
      let test = [];
      for (let i = 0; i < res.length; i++){
        test.push(Number(res["id"]));
      }
      this.idVoters = test;
    });
  }

  /**
   * Une fonction permettant d'excécuter un GET à l'aide du protocol HTTP
   * @param link le lien pour accéder aux données que l'on veut récupérer
   * @returns un observable associé à la requête get du lien passé en paramètre
   */
  private getRequest(link : string){
    return this.http.get<any>(link);
  }

  private deletetRequest(link : string){
    return this.http.delete<any>(link);
  }

  /**
   * La modification de l'association a étée annullée quand je me suis rendu compte que le rendu était pour vendredi...
  private putRequest(link : string, data : {}){
    return this.http.put<any>(link, data);
  }
   */

  /**
   * Permet de récupérer une association par son nom et d'enregistrer les informations associer dans le format souhaité
   * @param name le nom de l'association que l'on souhaite modifier
   */
  getByName(name: String){
    this.getRequest("http://localhost:3000/associations/"+name).subscribe(
      res => {
        let test = []
        console.log(res)
        console.log(res.length)
          let members = res['members']
          let membersToString : String[] = []
          for(let j= 0; j < members.length; j++){
            let member = members[j]
            let memberToString = " Lastname : " + member['lastname'] + ", Firstname : " + member['firstname'] + ", Age : " + member['age'] + ", Role : " + member['role']
            membersToString.push(memberToString)
          }
          let newResult = {name:res['name'],dateOfCreation:res['dateOfCreation'],members:membersToString}
          test.push(newResult);
        this.dataSource = test;
        this.getRequest("http://localhost:3000/users/").subscribe(res=>{
          membersToString = []
          for (let i =0; i < res.length; i++){
            let member = res[i]
            let memberToString = " Lastname : " + member['lastname'] + ", Firstname : " + member['firstname'] + ", Age : " + member['age'] + ", id : " + member['id']
            membersToString.push(memberToString)
          }
          this.members = membersToString;
          console.log("this.members")
          console.log(this.members)
        })
        console.log(this.dataSource);
        this.dateOfCreation = res["dateOfCreation"];
      }
    )
  }

  /**
   * 
   */
  modify(){
    this.modificationsOn = true;
    this.delete = false;
  }

  /**
   * 
   */
  suppr(){
    this.modificationsOn = false;
    this.delete = true;
  }

  suscribeSuppr(){
    this.getRequest('http://localhost:3000/associations/' + this.name).subscribe( res =>{
      this.role = res["members"];
      console.log(this.role)
      this.supprRole();
      }   
    );  
  }

  /**
   * Permet de supprimer tous les rôles liés à l'association dans le back avant d'y supprimer l'association
   */
  supprRole(){
    console.log("suppr roles");
    console.log(this.role)
    for(let i =0; i < this.role.length; i++){
      let test = this.role[i]
      console.log(test['role'])
      this.getRequest('http://localhost:3000/roles/' + this.name + '/' +  test['role']).subscribe(res => {
        this.deletetRequest('http://localhost:3000/roles/' + (Number)(res) + '/' + this.name).subscribe(res => {
          if(i == this.role.length-1) {
            this.supprAssociation();
          }
        });  
      })
    }
    if(this.role.length == 0){
      console.log("coucou")
      this.supprAssociation();
    }
  }

  /**
   * Permet de supprimer l'association au niveau du back, renvoi ensuite à l'affichage des associations
   */
  supprAssociation(){
    console.log("suppr associations : " + this.name);
    this.deletetRequest('http://localhost:3000/associations/' + this.name).subscribe(res => {
      console.log("a suppr l'association");
      this.router.navigateByUrl("/associations");
    });
  }


}
