import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    const resquest: Observable<any> = this.http.get('http://localhost:3000/users', { observe: 'response' });
    resquest.toPromise().then(response => this.dataSource = response.body);
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
