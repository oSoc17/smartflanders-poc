import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import Ldfetch from 'ldfetch';
import n3 from 'n3';
//import Turtle from '../models/turtle';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';


@Injectable()
export class DataService {
  constructor() {       
}

  public get_data(): Promise<any>{
      var fetch = <any>new Ldfetch();
      let amount = 0;
      let max = 1000;
      let state = new n3.Store();
      return new Promise((resolve) => {
    fetch.get('http://linked.open.gent/parking/').then(response => {
      state.addTriples(response.triples);
      state.addPrefixes(response.prefixes);
      return response;
    }).then(response => {
      if (amount < max) {
        let responseStore = new n3.Store();
        responseStore.addTriples(response.triples);
        responseStore.addPrefixes(response.prefixes);
        //let prevUrl = responseStore.getTriples(null,"hydra:previous")[0].object;
        //return fetchUrl(prevUrl, amount+1, max, state);
      } else {
        return state;
      }
    }).then(res => resolve(res));
  })
  }

  private extractData(res: any){
    console.log("Response at this moment: \n " + res);
    let state = new n3.Store();
    state.addTriples(res.triples);
    state.addPrefixes(res.prefixes);
    console.log('State in extractData ::data.service.ts' + state);
    return state;      

  }
  private handleError(error: Response | any){
    console.log("There is an error in data.service.ts !");
  return Observable.throw("Error");
  }

}
