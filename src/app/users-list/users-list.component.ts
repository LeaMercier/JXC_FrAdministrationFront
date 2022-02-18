import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  wantToAddOrSuppr : boolean = false;
  addF: boolean = false;
  supprF: boolean = false;
  
  constructor(
    private role : RoleServiceService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    console.log("roles")
    this.role.getAllRoles().subscribe(res => {
      console.log(res);
    })
    
    const resquest: Observable<any> = this.http.get('http://localhost:3000/users', { observe: 'response' });
    resquest.toPromise().then(response => {
      this.dataSource = response.body
      console.log(this.dataSource)});
  }

  add() : void {
    this.addF=true;
    this.supprF=false;
    this.wantToAddOrSuppr = true;
  }


  supr() : void {  
    this.addF=false;
    this.supprF=true; 
    this.wantToAddOrSuppr = true; 
  }
}
