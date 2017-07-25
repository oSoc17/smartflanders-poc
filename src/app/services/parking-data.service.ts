import { Observable } from 'rxjs/Observable';
import { TriplesToMeasurements } from './../shared/helpers/TriplesToMeasurements';
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
import { find } from 'lodash';

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
        value: value,
        parkingUrl: uri
      });
    });
    return measurements;
  }
  public static getMeasurementsWithoutStore(uri, triples): Measurement[] {
    const usedTriples = [];
    const graphs = []
    const _measurements: Array < Measurement > = [];
    for (let index = 0; index < triples.length; index++) {
      if (triples[index].subject === uri && triples[index].predicate === 'http://vocab.datex.org/terms#parkingNumberOfVacantSpaces') {
        usedTriples.push(triples[index])
      }
      if (triples[index].predicate === 'http://www.w3.org/ns/prov#generatedAtTime') {
        graphs.push(triples[index]);
      }
    }
    for (let index = 0; index < usedTriples.length; index++) {
      const graphTriple = find(graphs, (o) => {
        return usedTriples[index].graph === o.subject
      });
      _measurements.push(new Measurement(moment(n3.Util.getLiteralValue(graphTriple.object)).unix(),
        n3.Util.getLiteralValue(usedTriples[index].object), uri));
    }
    return _measurements.sort(this.compare);
  }
    private static compare(a, b) {
    if (a.timestamp < b.timestamp) {return 1;
    }
    if (a.timestamp > b.timestamp) {return -1;
    }
      return 0;
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
  public getNewestParkingData(uris, datasetUrl): Promise < Array < any > > {
    return new Promise((resolve) => {
      this.fetch.get(datasetUrl).then(response => {
        // Latest measurements are not in volatile cache, get from web
        // Put all triples in store
        // Get all measurements
        const result = [];
        let latest;
        uris.forEach(uri => {
          result[uri] = ParkingDataService.getMeasurementsWithoutStore(uri, response.triples);
          let latestTimestamp = 0;
          if (result[uri].measurements) {
            result[uri].measurements.forEach((measurement) => {
              if (measurement.timestamp > latestTimestamp) {
                latestTimestamp = measurement.timestamp;
                latest = measurement;
              }
            });
          }
        });
        console.log(result);
        resolve(result);

      });
    })
  }

  /**
   * Fetches the newest measurement for a certain parking
   * @param uri the uri of the parking
   * @param datasetUrl the url of the dataset where this parking can be found
   * @returns {Promise<Measurement>}
   */
  public getNewestParkingDataForCity(parkings, datasetUrl: string): Observable < Array <any > > {
    return new Observable(observer => {
        this.fetch.get(datasetUrl).then(response => {
        const result = [];
        let latest;
        parkings.forEach(parking => {
          result[parking.uri] = ParkingDataService.getMeasurementsWithoutStore(parking.uri, response.triples);
          let latestTimestamp = 0;
          if (result[parking.uri].measurements) {
            result[parking.uri].measurements.forEach((measurement) => {
              if (measurement.timestamp > latestTimestamp) {
                latestTimestamp = measurement.timestamp;
                latest = measurement;
              }
            });
          }
        });
     observer.next(result);
    })
  })
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
  public getParkingHistory(uri, from, to, datasetUrl) {
    const entry = datasetUrl + '?time=' + moment.unix(to).format('YYYY-MM-DDTHH:mm:ss');
    return Observable.create(observer => {
      const pdi = new ParkingDataInterval(from, to, entry, uri, observer);
      pdi.fetch();
    })
  }

  /**
   * Fetches static data for all parkings from a certain dataset
   * @returns {Promise<Parking[]>}
   */
  public getParkings(datasetUrl): Observable <Parking> {
    return Observable.create(observer => {
      this.fetch.get(datasetUrl).then(response => {
        // Get all subjects that are parkings
        const parkingTriples = [],
          parkings = [],
          totalspacesParking = [],
          labels = [];
        for (let index = 0; index < response.triples.length; index++) {
          if (response.triples[index].object === 'http://vocab.datex.org/terms#UrbanParkingSite') {
            parkingTriples.push(response.triples[index]);
          }
          if (response.triples[index].predicate === 'http://vocab.datex.org/terms#parkingNumberOfSpaces') {
            totalspacesParking.push(response.triples[index]);
          }
          if (response.triples[index].predicate === 'http://www.w3.org/2000/01/rdf-schema#label') {
            labels.push(response.triples[index]);
          }
        }
        if (parkingTriples.length <= 0) {
          observer.error();
        }
        for (let index = 0; index < parkingTriples.length; index++) {
          const totalspacesresult = find(totalspacesParking, (o) => {
            return o.subject === parkingTriples[index].subject
          });
          const totalspaces = parseInt(n3.Util.getLiteralValue(totalspacesresult.object), 10);
          const labelresult = find(labels, (o) => {
            return o.subject === parkingTriples[index].subject
          });
          const rdfslabel = n3.Util.getLiteralValue(labelresult.object);
          const id = rdfslabel.replace(' ', '-').toLowerCase();
          observer.next(new Parking(rdfslabel, parkingTriples[index].subject, id, totalspaces, datasetUrl));
        }
        observer.complete();
      })
    })
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

