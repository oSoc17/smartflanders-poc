import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import Triple from '../models/Triple';

import ldfetch from 'ldfetch';
import n3 from 'n3';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import Parking from '../models/parking';


@Injectable()
export class ParkingDataService {
  constructor() {}

  public get_data(): Promise<any> {
    const fetch = <any> new ldfetch();
    const amount = 0;
    const max = 1000;
    const state = new n3.Store();
    const triples: Array<Triple> = [];

    return new Promise((resolve) => {
      fetch.get('http://linked.open.gent/parking/').then(response => {
        state.addTriples(response.triples);
        state.addPrefixes(response.prefixes);
        const responseStore = new n3.Store();
        responseStore.addTriples(response.triples);
        responseStore.addPrefixes(response.prefixes);
        // let prevUrl = responseStore.getTriples(null,"hydra:previous")[0].object;
        // return fetchUrl(prevUrl, amount+1, max, state);
        resolve(responseStore);
      })
    })
  }

  public getParkings(): any {
    const fetch = new ldfetch();

    return new Promise((resolve) => {
      fetch.get('http://linked.open.gent/parking/').then(response => {
        // Put all triples in a store
        const store = new n3.Store(response.triples, {prefixes: response.prefixes});

        // Get all subjects that are parkings
        const parkingTriples = store.getTriples(null, 'rdf:type', 'datex:UrbanParkingSite');

        // Get static data for each parking
        const parkings: Parking[] = [];
        parkingTriples.forEach(parking => {
          const uri = parking.subject;
          const name = store.getTriples(uri, 'rdfs:label')[0].object;
          const totalSpaces = parseInt(store.getTriples(uri, 'datex:numberOfSpaces')[0].object, 10);
          parkings.push({
            uri: uri,
            name: name,
            totalSpaces: totalSpaces
          });
        });
        resolve(parkings);
      })
    })
  }

  private handleError(error: Response | any) {
    console.log('There is an error in data.service.ts !');

    return Observable.throw('Error');
  }

}
