import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialAndLegalServiceService {
  
  financialValidation !: Boolean;
  legalValidation !: Boolean;
  verbalPocessId !: number;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Permet de créer un AssociationForm
   */
  createAssociationForm() {
    let request = this.sendPostRequest('http://localhost:3000/association-forms/', {});
    return request;
  }

  /**
   * Fonction permettant de faire un put sur le lien passé en paramètre et de lui passer les valeurs data
   * @param link : le lien sur lequel on veut faire notre put
   * @param data : les données que l'on veut traiter
   * @returns Un observable sur la requête crée
   */
  sendPutRequest(link : string, data: any): Observable<any> {
    return this.http.put<any>(link, data);
  }

  sendPostRequest(link : string, data: any): Observable<any> {
    return this.http.post<any>(link, data);
  }

  /**
   * Nous permet de valider notre association form.
   * Si elle n'est pas créée, on l'a crée.
   */
  validateFinancialy(id : number){
    let data = {associationFormId : id};
    let request = this.sendPutRequest('http://localhost:3000/financial-service/validate/', data)
    request.subscribe(
      res => {
        this.financialValidation = (Boolean)(res['financialValidation']);
      }
    );
    return request;
  }

  /**
   * Permet de valider légalement notre association form.
   * Si elle n'est pas créée, on l'a crée.
   * Si elle n'est pas validée, ou invalidée, financièrement on l'envoie se faire valider avant de la tester.
   */
  validateLegaly(id : number){
    let data = {associationFormId : id};
    let request = this.sendPutRequest('http://localhost:3000/legal-service/validate/', data)
    request.subscribe(
      res => {
        this.legalValidation = (Boolean)(res['legalValidation']);
      }
    );
    return request;
  }

    /**
     * Permet de récupérer l'aval ou le refus légal pour notre association form.
     * Si elle n'est pas créée et/ou non validé légalement et fincancièrement.
     * On la créee et/ou la valide.
     */
    getLegalValidation(){
      return this.legalValidation
    }
    /**
     * Permet de récupérer l'aval ou le refus financier pour notre association form.
     * Si elle n'est pas créée et/ou non validé fincancièrement.
     * On la créee et/ou la valide.
     */
    getFinancialValidation(){
      return this.financialValidation;
    }

    getVerbalProcessId(idVotersInput:number[], contentInput:string, dateInput:string){
      let dataToSend = {idVoters: idVotersInput, content:contentInput, date:dateInput}
      return this.sendPostRequest('http://localhost:3000/verbal-processes/',dataToSend)
    }
}
