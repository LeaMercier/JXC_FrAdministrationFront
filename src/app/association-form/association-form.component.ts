import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UsersListComponent } from '../users-list/users-list.component';

@Component({
  selector: 'app-association-form',
  templateUrl: './association-form.component.html',
  styleUrls: ['./association-form.component.css']
})
export class AssociationFormComponent implements OnInit {

  @Input()
  add !: boolean;
  @Input()
  suppr !: boolean;

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

  /**
   * If route add, we add
   * If routte suppr, we suppr
   */
  constructor(
    private http: HttpClient,
    private list : UsersListComponent
  ) { }

  ngOnInit(): void {
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

  sendPostRequest(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/users/', data);
  }



  sendDeleteRequest(link:string, data:object): Observable<any> {
    return this.http.delete<any>(link, data);
  }

  

  /**
   * Une fois que le questionnaire est rempli, on supprime ou ajoute en fonction du choix de l'utilisateur
   */
  submit(): void{
    if(this.add){
      const postRequest = {firstname : this.firstname, lastname : this.lastname, age : this.age};
      console.log("est en train d'ajouter l'élément");
      this.sendPostRequest(postRequest).subscribe(
        res => {
          console.log(res);
          this.list.ngOnInit();
        }
      );
    } else { // cas où on supprime
      //this.sendDeleteRequest('http://localhost:3000/roles/' + this.)
      this.sendDeleteRequest('http://localhost:3000/users/'+this.id, {}).subscribe(
        res => {
          console.log(res);
          this.list.ngOnInit();
        }
      );
    }
  }

}
