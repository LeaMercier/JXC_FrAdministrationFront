import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-association-list',
  templateUrl: './association-list.component.html',
  styleUrls: ['./association-list.component.css']
})
export class AssociationListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'dateOfCreation', 'members'];
  dataSource = [];

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const resquest: Observable<any> = this.http.get('http://localhost:3000/associations', { observe: 'response' });
    resquest.toPromise().then(response => this.dataSource = response.body);
  }

}
