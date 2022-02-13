import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiHelperService } from './services/api-helper.service';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {
  roles = [];

  constructor(
    private http: HttpClient,
    private api: ApiHelperService
  ) { }

  /**
   * Permet de récupérer tout les rôles
   * @returns 
   */
  getAllRoles(){
    if(this.roles == undefined || this.roles.length == 0){
      const resquest: Observable<any> = this.http.get('http://localhost:3000/roles', { observe: 'response' });
      resquest.toPromise().then(response => {
        console.log(response.body)
        this.roles = response.body});
    } 
    return of(this.roles);
  }

  getRolesByIdUser(id:number){
    let rolesRendu = []
    if(this.roles == undefined || this.roles.length == 0){
      this.getAllRoles()
    }
    for (let i in this.roles){
      if (Number(i[0]) == id){
        return i
      }
    }
    return -1;
  }

  sendPutRequest(link : string, data: any): Observable<any> {
    return this.http.put<any>(link, data);
  }

  deleteRole(idUser:number, nameAssociation:string){
      let data = {userID : idUser, associationName : nameAssociation}
      console.log(this.api.delete({endpoint:'roles', data: data}));
      return this.http.delete<any>('http://localhost:3000/roles/');
  }

  getRoleByIdAssociation(name:String){
    if(this.roles == undefined || this.roles.length == 0){
      this.getAllRoles()
    }
    for (let i in this.roles){
      if (i[1] == name){
        return i
      }
    }
    return -1;
  }
}
