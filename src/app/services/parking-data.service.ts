import { Injectable } from '@angular/core';

import ldfetch from 'ldfetch';
import n3 from 'n3';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import Parking from '../models/parking';
import ParkingHistory from '../models/parking-history';
import Measurement from '../models/measurement';
import * as moment from 'moment';

@Injectable()
export class ParkingDataService {
  private static getParking(uri, store): Parking {
    const name = n3.Util.getLiteralValue(store.getTriples(uri, 'rdfs:label')[0].object);
    const totalSpacesObj = store.getTriples(uri, 'datex:parkingNumberOfSpaces')[0].object;
    const totalSpaces = parseInt(n3.Util.getLiteralValue(totalSpacesObj), 10);
    return {
      uri: uri,
      name: name,
      totalSpaces: totalSpaces
    }
  }

  private static getMeasurements(uri, store): Measurement[] {
    const measurementTriples = store.getTriples(uri, 'datex:parkingNumberOfVacantSpaces');
    const measurements: Measurement[] = [];

    measurementTriples.forEach(triple => {
      const generatedAtTriple = store.getTriples(triple.graph, 'http://www.w3.org/ns/prov#generatedAtTime')[0];
      const genTimestamp = n3.Util.getLiteralValue(generatedAtTriple.object);
      const genTime = moment(genTimestamp).unix();
      const value = n3.Util.getLiteralValue(triple.object);
      console.log(genTime);
      measurements.push({
        timestamp: genTime,
        value: value
      });
    });
    return measurements;
  }

  constructor() {}

  public getNewestParkingData(uri): Promise<Measurement> {
    const fetch = new ldfetch();

    return new Promise((resolve) => {
      fetch.get('http://linked.open.gent/parking/').then(response => {
        // Put all triples in store
        const store = new n3.Store(response.triples, {prefixes: response.prefixes});

        // Get all measurements
        const measurements = ParkingDataService.getMeasurements(uri, store);

        // Get latest
        let latest: Measurement;
        let latestTimestamp = 0;
        measurements.forEach((measurement) => {
          if (measurement.timestamp > latestTimestamp) {
            latestTimestamp = measurement.timestamp;
            latest = measurement;
          }
        });

        resolve(latest);
      })
    });
  }

  public getParkingHistory(uri, from, to): Promise<ParkingHistory> {
    const fetch = new ldfetch();

    return new Promise((resolve) => {
      fetch.get('http://linked.open.gent/parking/').then(response => {
        // Put all triples in store
        const store = new n3.Store(response.triples, {prefixes: response.prefixes});

        // Get parking and timeframe from store
        const timeframe = ParkingDataService.getMeasurements(uri, store);
        const parking = ParkingDataService.getParking(uri, store);

        resolve({
          parking: parking,
          timeframe: timeframe
        });
      });
    });
  }

  public getParkings(): Promise<Parking[]> {
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
          parkings.push(ParkingDataService.getParking(uri, store));
        });

        resolve(parkings);
      })
    })
  }
}
