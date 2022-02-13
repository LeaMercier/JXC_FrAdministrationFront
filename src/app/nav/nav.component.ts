import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {


  isLogged !: boolean;

  constructor(
    private service: TokenStorageService,
    private route: Router
    ) {}

  ngOnInit(): void {
    this.service.isLoggedObservable().subscribe(logged =>{
      this.isLogged = (Boolean)(logged);
      console.log(this.isLogged);
    });
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
  

}
