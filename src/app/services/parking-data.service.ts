import {Injectable} from '@angular/core';

import ldfetch from 'ldfetch';
import n3 from 'n3';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {EventEmitter} from 'events';

import Parking from '../models/parking';
import Measurement from '../models/measurement';
import {ParkingDataInterval} from './parking-data-interval';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ParkingDataService {
  private fetch;
  public parkings: Array<Parking> = [];
  private datasetUrls = {
    'Kortrijk': 'http://kortrijk.datapiloten.be/parking/',
    'Gent': 'http://linked.open.gent/parking/',
    'Leuven': 'http://leuven.datapiloten.be/parking/',
    'Sint-Niklaas': 'https://sint-niklaas.datapiloten.be/parking',
    'Nederland': 'https://nederland.datapiloten.be/parking'
  };

  private fetchedUris: string[];
  private fetchQueue: string[];
  private entry: string;
  private parking: string;

  /**
   * Gets all static data for a certain parking from an N3 store
   * @param uri the uri of the parking
   * @param store the N3 store of triples
   * @returns {Parking}
   */
  public static getParking(uri, store, datasetUrl): Parking {
    const totalSpacesObj = store.getTriples(uri, 'datex:parkingNumberOfSpaces')[0].object;
    const totalSpaces = parseInt(n3.Util.getLiteralValue(totalSpacesObj), 10);
    const rdfslabel = n3.Util.getLiteralValue(store.getTriples(uri, 'rdfs:label')[0].object);
    const id = rdfslabel.replace(' ', '-').toLowerCase();
    return {
      uri: uri,
      cityUrl: datasetUrl,
      name: rdfslabel,
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
   * @param datasetUrl the url of the dataset where this parking can be found
   * @returns {Promise<Measurement>}
   */
  public getNewestParkingData(uri, datasetUrl): Promise<Measurement> {
    return new Promise((resolve) => {
      let latest: Measurement;
      this.fetch.get(datasetUrl).then(response => {
        // Put all triples in store
        const store = new n3.Store(response.triples, {
          prefixes: response.prefixes
        });
        // Get all measurements
        const measurements = ParkingDataService.getMeasurements(uri, store);
        // Get latest
        let latestTimestamp = 0;
        if (measurements) {
          measurements.forEach((measurement) => {
            if (measurement.timestamp > latestTimestamp) {
              latestTimestamp = measurement.timestamp;
              latest = measurement;
            }
          });
          resolve(latest);
        }
      });
    });
  }

  public getDatasetUrls(): any {
    return this.datasetUrls;
  }


  /**
   * Fetches a time frame of measurements for a certain parking as a ParkingHistory object
   * @param uri the uri of the parking
   * @param from UNIX timestamp depicting the beginning of the time frame
   * @param to UNIX timestamp depicting the end of the time frame
   * @param datasetUrl the url of the dataset where the parking can be found
   * @returns ParkingDataInterval: call fetch() on this object to start fetching, cancel() to cancel
   */
  public getParkingHistory (uri, from, to , datasetUrl): Observable<Measurement>  {
    const entry = datasetUrl + '?time=' + moment.unix(to).format('YYYY-MM-DDTHH:mm:ss');
    this.fetchQueue = [entry];
    const _observable = Observable.create(observer => {
      this.historyFetch(observer, uri, from, to, datasetUrl, entry);
    });
    return _observable;
  }

  private historyFetch (observer, uri, from, to, datasetUrl, entry) {
    const link = this.fetchQueue.pop();
    if (link !== undefined && this.fetchedUris.indexOf(link) === -1) {
      this.fetchedUris.push(link);
      new ldfetch().get(link).then(response => {
        const store = new n3.Store(response.triples, {prefixes: response.prefixes});
        const timeframe = ParkingDataService.getMeasurements(this.parking, store);
        let hasOverlap = false;
        timeframe.forEach(measurement => {
          if (from <= measurement.timestamp && measurement.timestamp <= to) {
              observer.next(measurement);
              hasOverlap = true;
          }
        });
        if ((hasOverlap || link === this.entry)) {
          const prevLinks = store.getTriples(null, 'hydra:previous');
          const nextLinks = store.getTriples(null, 'hydra:next');
          if (prevLinks.length > 0) {
            this.fetchQueue.push(prevLinks[0].object);
          }
          if (nextLinks.length > 0) {
            this.fetchQueue.push(nextLinks[0].object);
          }
        }
        this.historyFetch(observer, uri, from, to, datasetUrl, entry);
      });
    } else if (link !== undefined) {
      this.historyFetch(observer, uri, from, to, datasetUrl, entry);
    }
  }

  /**
   * Fetches static data for all parkings from a certain dataset
   * @returns {Promise<Parking[]>}
   */
  public getParkings(datasetUrl): Promise<Parking[]> {
    return new Promise((resolve) => {
      this.fetch.get(datasetUrl).then(response => {
        // Put all triples in a store
        const parkingTriples2 = [];
        const store = new n3.Store(response.triples, {
          prefixes: response.prefixes
        });
        // Get all subjects that are parkings
        const parkingTriples = store.getTriples(null, 'rdf:type', 'datex:UrbanParkingSite');
        // Get static data for each parking
        const parkings = [];
        parkingTriples.forEach(parking => {
          const uri = parking.subject;
          parkings.push(ParkingDataService.getParking(uri, store, datasetUrl));
        });
        this.parkings = parkings;
        resolve(parkings);
      })
    });
  }
}
