import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  // Informations to show 

  id !: number;
  firstname !: string;
  lastname !: string;
  age !: string;

  // Boolean Part
  modificationsOn : boolean = false;

  profileForm = new FormGroup({
    firstname: new FormControl(),
    lastname: new FormControl(),
    age: new FormControl(),
  });

  constructor(
    private route:ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( (params: ParamMap) => { 
      console.log(Number(params.get('id')));
      let id = params.get('id');
      this.id = Number(id);
      if(id != undefined){
        this.getUserById(id);
      }
    });
    this.profileForm.get('firstname')?.valueChanges.subscribe(res => {
      this.firstname = res.toString();
    })
    this.profileForm.get('lastname')?.valueChanges.subscribe(res => {
      this.lastname = res.toString();
    })
    this.profileForm.get('age')?.valueChanges.subscribe(res => {
      this.age = res.toString();
    })
  }

  private getRequest(link : string){
    return this.http.get<any>(link);
  }

  private putRequest(link : string, data : {}){
    return this.http.put<any>(link, data);
  }

  getUserById(id : String){
    this.getRequest("http://localhost:3000/users/id/"+id).subscribe(res => {
      let firstname = res['firstname'];
      this.firstname = firstname;
      let lastname = res['lastname'];
      this.lastname = lastname;
      let age = res['age'];
      this.age = age;
    });
  }

  applyModifications(){
    let datanewD ={firstname : this.firstname, lastname : this.lastname, age: this.age};
    this.putRequest("http://localhost:3000/users/"+this.id,datanewD).subscribe( res => {
      console.log("rendu")
      console.log(res);
    });
  }

  modify(){
    this.modificationsOn = true;
  }

  submit(){
    this.modificationsOn = false;
    this.applyModifications();
  }


}
