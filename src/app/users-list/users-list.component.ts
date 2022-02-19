import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { RoleServiceService } from '../role-service.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'lastname', 'firstname', 'age'];
  dataSource = [];
  addF: boolean = false;
  supprF: boolean = false;

  lastname !: String;
  firstname !: String;
  age !: number;
  id !: number;

  profileForm = new FormGroup({
    firstname: new FormControl(),
    lastname: new FormControl(),
    age: new FormControl(),
    id: new FormControl() // rest à trouver un moyen de le rendre optionnel dans le cas de l'ajout
  });


  constructor(
    private http: HttpClient
  ) { }

  sendGetRequest(link : string): Observable<any> {
    return this.http.get<any>(link);
  }

  ngOnInit(): void {
    this.addF = false;
    this.supprF = false;
    this.sendGetRequest('http://localhost:3000/users').subscribe(res => {
        this.dataSource = res;
        console.log(res);
    });
    this.profileForm.get('firstname')?.valueChanges.subscribe(res => {
      this.firstname = res.toString();
    })
    this.profileForm.get('lastname')?.valueChanges.subscribe(res => {
      this.lastname = res.toString();
    })
    this.profileForm.get('age')?.valueChanges.subscribe(res => {
      this.age = Number(res);
    })
    this.profileForm.get('id')?.valueChanges.subscribe(res => {
      this.id = Number(res);
    })
  }

  add() : void {
    this.addF=true;
    this.supprF=false;
    console.log(this.addF)
  }


  supr() : void {  
    this.addF=false;
    this.supprF=true; 
  }


  sendPostRequest(link:string, data: any): Observable<any> {
    return this.http.post<any>(link, data);
  }



  sendDeleteRequest(link:string, data:object): Observable<any> {
    return this.http.delete<any>(link, data);
  }

  

  /**
   * Une fois que le questionnaire est rempli, on supprime ou ajoute en fonction du choix de l'utilisateur
   */
  submit(): void{
    if(this.addF){
      const postRequest = {firstname : this.firstname, lastname : this.lastname, age : this.age};
      this.sendPostRequest('http://localhost:3000/users/',postRequest).subscribe(
        res => {
          this.ngOnInit();
        }
      );
    } else if(this.supprF) { // cas où on supprime
      //http://localhost:3000/users/:id/roles
      let rolesDeLUt = [];

      // Suppression Roles
      this.sendGetRequest('http://localhost:3000/users/'+this.id+'/roles').subscribe(res =>{
        rolesDeLUt = res;
        console.log(rolesDeLUt);
        for (let i = 0; i< rolesDeLUt.length; i++){
          let name = rolesDeLUt[i].association.name
          let dataToSuppr = {userId:this.id, associationName:name};
          console.log(dataToSuppr);
          this.sendDeleteRequest('http://localhost:3000/roles/' + this.id + '/' + name, {}).subscribe( res => {
              console.log(res);
              if(i == rolesDeLUt.length-1) this.deleteUSer()
            }          
          );
        }

      });

    }
  }

  deleteUSer(){
    // Suppression User
     this.sendDeleteRequest('http://localhost:3000/users/'+this.id, {}).subscribe(
       res => {
         console.log(res);
         this.ngOnInit();
       }
     );
  }
}
