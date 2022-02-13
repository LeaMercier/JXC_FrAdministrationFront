import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RoleServiceService } from '../role-service.service';

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
  }

  private getRequest(link : string){
    return this.http.get<any>(link);
  }

  getUserById(id : String){
    this.getRequest(("http://localhost:3000/users/id/"+id)).subscribe(res => {
      console.log(res)
      let firstname = res['firstname'];
      this.firstname = firstname;
      let lastname = res['lastname'];
      this.lastname = lastname;
      let age = res['age'];
      this.age = age;
    })
  }

  modify(){
    this.modificationsOn = true;
  }

  submit(){
    this.modificationsOn = false;
  }

  //http://localhost:3000/users/id/1

}
