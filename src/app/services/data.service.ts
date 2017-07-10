import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import Triple from '../models/triple';

import ldfetch from 'ldfetch';
import n3 from 'n3';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class DataService {
  constructor() {}

  public get_data(): Promise<any> {
    let fetch = <any> new ldfetch();
    let amount = 0;
    let max = 1000;
    let state = new n3.Store();
    let triples: Array<Triple> = [];

    return new Promise((resolve) => {
      fetch.get('http://linked.open.gent/parking/').then(response => {
      state.addTriples(response.triples);
      state.addPrefixes(response.prefixes);
      const responseStore = new n3.Store();
      responseStore.addTriples(response.triples);
      responseStore.addPrefixes(response.prefixes);
      // let prevUrl = responseStore.getTriples(null,"hydra:previous")[0].object;
      // return fetchUrl(prevUrl, amount+1, max, state);
      console.log(response);
      response.triples.forEach(triple => {
        triples.push(new Triple(triple.subject, triple.predicate, triple.object, triple.graph));
      });
      console.log(triples);
      resolve(triples);
      })
    })
  }

  public getParkings(): any {
    const state = new n3.Store();
    const fetch = <any> new ldfetch();
    return new Promise((resolve) => {
      fetch.get('http://linked.open.gent/parking/').then(response => {
      state.addTriples(response.triples);
      state.addPrefixes(response.prefixes);
      const responseStore = new n3.Store();
      responseStore.addTriples(response.triples);
      responseStore.addPrefixes(response.prefixes);
      resolve(state);
      })
    })
  }

  private extractData(res: any){
    console.log('Response at this moment: \n ' + res);
    let state = new n3.Store();
    state.addTriples(res.triples);
    state.addPrefixes(res.prefixes);
    console.log('State in extractData ::data.service.ts' + state);
    return state;
  }
  private handleError(error: Response | any){
    console.log('There is an error in data.service.ts !');

    return Observable.throw('Error');
  }

}
