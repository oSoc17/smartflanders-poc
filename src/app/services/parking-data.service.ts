import {Injectable} from '@angular/core';

import ldfetch from 'ldfetch';
import n3 from 'n3';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {EventEmitter} from 'events';

import Parking from '../models/parking';
import ParkingHistory from '../models/parking-history';
import Measurement from '../models/measurement';
import {ParkingDataInterval} from './parking-data-interval';
import * as moment from 'moment';

@Injectable()
export class ParkingDataService {
  private fetch;

  /**
   * Gets all static data for a certain parking from an N3 store
   * @param uri the uri of the parking
   * @param store the N3 store of triples
   * @returns {Parking}
   */
  public static getParking(uri, store): Parking {
    const totalSpacesObj = store.getTriples(uri, 'datex:parkingNumberOfSpaces')[0].object;
    const totalSpaces = parseInt(n3.Util.getLiteralValue(totalSpacesObj), 10);
    const rdfslabel = n3.Util.getLiteralValue(store.getTriples(uri, 'rdfs:label')[0].object);
    const id = rdfslabel.replace(' ', '-').toLowerCase();
    const name = n3.Util.getLiteralValue(store.getTriples(uri, 'dct:description')[0].object);
    return {
      uri: uri,
      name: name,
      totalSpaces: totalSpaces,
      id: id
    }
  }

  /**
   * Gets all measurements for a certain parking from an N3 store
   * @param uri the uri of the parking
   * @param store the N3 store of triples
   * @returns {Measurement[]} (time frame, not necessarily sorted)
   */
  public static getMeasurements(uri, store): Measurement[] {
    const measurementTriples = store.getTriples(uri, 'datex:parkingNumberOfVacantSpaces');
    const measurements: Measurement[] = [];

    measurementTriples.forEach(triple => {
      const generatedAtTriple = store.getTriples(triple.graph, 'http://www.w3.org/ns/prov#generatedAtTime')[0];
      const genTimestamp = n3.Util.getLiteralValue(generatedAtTriple.object);
      const genTime = moment(genTimestamp).unix();
      const value = n3.Util.getLiteralValue(triple.object);
      measurements.push({
        timestamp: genTime,
        value: value
      });
    });
    return measurements;
  }

  constructor() {
    this.fetch = new ldfetch();
  }

  /**
   * Fetches the newest measurement for a certain parking
   * @param uri the uri of the parking
   * @returns {Promise<Measurement>}
   */
  public getNewestParkingData(uri): Promise<Measurement> {
    return new Promise((resolve) => {
      this.fetch.get('http://linked.open.gent/parking/').then(response => {
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

  /**
   * Fetches a time frame of measurements for a certain parking as a ParkingHistory object
   * @param uri the uri of the parking
   * @param from UNIX timestamp depicting the beginning of the time frame
   * @param to UNIX timestamp depicting the end of the time frame
   * @param onData the function to call when data is available
   * @returns {Promise<ParkingHistory>}
   *
   * public getParkingHistory(uri, from, to, onData) {
   *  const entry = 'http://linked.open.gent/parking/?time=' + moment.unix(to).format('YYYY-MM-DDTHH:mm:ss');
   *  const pdi = new ParkingDataInterval(from, to, entry, uri);
   * (pdi as EventEmitter).on('data', onData);
   *  pdi.fetch();
   *}
   */
  public getParkingHistory(uri, from, to, onData) {
    const entry = 'http://linked.open.gent/parking/?time=' + moment.unix(to).format('YYYY-MM-DDTHH:mm:ss');
    console.log(entry);
    const pdi = new ParkingDataInterval(from, to, entry, uri);
    (pdi as EventEmitter).on('data', onData);
    pdi.fetch();
  }

  /**
   * Fetches static data for all parkings
   * @returns {Promise<Parking[]>}
   */
  public getParkings(): Promise<Parking[]> {
    return new Promise((resolve) => {
      this.fetch.get('http://linked.open.gent/parking/').then(response => {
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
