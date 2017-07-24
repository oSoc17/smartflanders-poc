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

@Injectable()
export class ParkingDataService {

  private fetch;
  private _volatileCache = {}; // url => {store, UNIX timestamp of creation}
  private datasetUrls = {
    'Kortrijk': 'http://kortrijk.datapiloten.be/parking/',
    'Gent': 'http://linked.open.gent/parking/',
    'Leuven': 'http://leuven.datapiloten.be/parking/',
    'Sint-Niklaas': 'https://sint-niklaas.datapiloten.be/parking',
    'Nederland': 'https://nederland.datapiloten.be/parking'
  };

  /**
   * Gets all static data for a certain parking from an N3 store
   * @param uri the uri of the parking
   * @param store the N3 store of triples
   * @param datasetUrl url of the city dataset
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
      const generatedAtTriple = store.getTriplesByIRI(triple.graph, 'http://www.w3.org/ns/prov#generatedAtTime')[0];
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
  public getNewestParkingData(uri, datasetUrl): Promise < Measurement > {
    return new Promise((resolve) => {
      const cache = this.getFromVolatileCache(uri);
      let latest: Measurement;
      if (cache) {
        // Latest measurements are in volatile cache
        const measurements = ParkingDataService.getMeasurements(uri, cache);
        let latestTimestamp = 0;
        measurements.forEach((measurement) => {
          if (measurement.timestamp > latestTimestamp) {
            latestTimestamp = measurement.timestamp;
            latest = measurement;
          }
        });
        resolve(latest);
      } else {
        this.fetch.get(datasetUrl).then(response => {
          // Latest measurements are not in volatile cache, get from web
          // Put all triples in store
          const store = new n3.Store(response.triples, {
            prefixes: response.prefixes
          });
          // Get all measurements
          const measurements = ParkingDataService.getMeasurements(uri, store);

          // Write data to volatile cache
          this.writeToVolatileCache(datasetUrl, store);

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
      }
    });
  }

  // This should become a request to a registry endpoint
  public getDatasetUrls() {
    return new Promise((resolve) => resolve(this.datasetUrls));
  }


  /**
   * Fetches a time frame of measurements for a certain parking as a ParkingHistory object
   * @param uri the uri of the parking
   * @param from UNIX timestamp depicting the beginning of the time frame
   * @param to UNIX timestamp depicting the end of the time frame
   * @param onData the function to call when data is available
   * @param datasetUrl the url of the dataset where the parking can be found
   * @returns ParkingDataInterval: call fetch() on this object to start fetching, cancel() to cancel
   */
  public getParkingHistory(uri, from, to, onData, datasetUrl) {
    const entry = datasetUrl + '?time=' + moment.unix(to).format('YYYY-MM-DDTHH:mm:ss');
    const pdi = new ParkingDataInterval(from, to, entry, uri);
    (pdi as EventEmitter).on('data', onData);
    return pdi;
  }

  /**
   * Fetches static data for all parkings from a certain dataset
   * @returns {Promise<Parking[]>}
   */
  public getParkings(datasetUrl): Promise < Parking[] > {
    return new Promise((resolve) => {
      this.fetch.get(datasetUrl).then(response => {
        // Put all triples in a store
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
        resolve(parkings);
      })
    });
  }

  // Gets a measurement array from volatile cache (30 seconds).
  // If present: checks if not outdated, removes if it is
  // If not present: return false
  private getFromVolatileCache(url) {
    if (this._volatileCache[url] !== undefined) {
      const cacheObj = this._volatileCache[url];
      const now = moment().unix();
      if (now - cacheObj.timestamp <= 30) {
        return cacheObj.measurements;
      }
      delete this._volatileCache[url];
    }
    return false;
  }

  private writeToVolatileCache(url, measurements) {
    const now = moment().unix();
    this._volatileCache[url] = {measurements: measurements, timestamp: now};
  }
}

