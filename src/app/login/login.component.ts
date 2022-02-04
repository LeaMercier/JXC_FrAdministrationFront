import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHelperService } from '../services/api-helper.service'
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private api: ApiHelperService,
    private tokenStorageService: TokenStorageService,
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    const username: string = (document.getElementById('username') as HTMLInputElement).value;
    const password: string = (document.getElementById('password') as HTMLInputElement).value;
    this.api.post({endpoint: '/auth/login', data: { username, password },})
    .then(response => {
      this.tokenStorageService.save(response.access_token);
      this.route.navigateByUrl("/home");
    });
  }


}
