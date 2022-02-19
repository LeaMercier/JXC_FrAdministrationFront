import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  myControl = new FormControl();

  isLogged !: boolean;
  listElements : string[] = [];
  mapDeCoresspondance = new Map();
  filteredListUser !: Observable<string[]>;
  element !: string;

  profileForm = new FormGroup({})

  constructor(
    private service: TokenStorageService,
    private route: Router,
    private http: HttpClient
    ) {}

  ngOnInit(): void {
    this.service.isLoggedObservable().subscribe(logged =>{
      this.isLogged = (Boolean)(logged);
    });
    this.filteredListUser = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    )
    
    this.sendGetRequest('http://localhost:3000/users').subscribe(res => {
      for(let i = 0; i < res.length; i++){
        let element = res[i];
        let id = element["id"].toString();
        this.listElements.push(id);
        this.mapDeCoresspondance.set(id, "/users/"+Number(id));
        let combi1 = element["firstname"].toString() + " " + element["lastname"].toString();
        this.listElements.push(combi1);
        this.mapDeCoresspondance.set(combi1, "/users/"+Number(id));
      }
      this.sendGetRequest('http://localhost:3000/associations').subscribe(res => {
        for(let i = 0; i < res.length; i++){
          let element = res[i];
          let name = element["name"].toString();
          this.listElements.push(name);
          this.mapDeCoresspondance.set(name, "/associations/"+name);
        }
      })
    })
    this.myControl.valueChanges.subscribe(res => {
      this.element = res;
    })
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.listElements.filter(option => 
      option.toLowerCase().includes(filterValue)
    );
  }

  sendGetRequest(link : string) {
    return this.http.get<any>(link);
  }

  logout(): void {
    console.log("click on logout !");
    this.service.clear();
    this.isLogged = false;
    this.route.navigateByUrl("/login");
  }

  goHome(){
    this.route.navigateByUrl("/home");
    this.service.isLoggedObservable().subscribe(logged =>{
      this.isLogged = (Boolean)(logged);
    });
  }

  submit(){
    console.log("coucou1")
    this.myControl.valueChanges.subscribe(res => {
      console.log("res")
      console.log(res)
    })
    this.filteredListUser.subscribe(res => {
      console.log("coucou2")
      if(res != undefined && this.element){
        let route = this.mapDeCoresspondance.get(this.element);
        this.route.navigateByUrl(route);
      }
    });
  }
  

}
