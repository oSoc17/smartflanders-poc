import ldfetch from 'ldfetch';
import n3 from 'n3';
import {ParkingDataService} from './parking-data.service';
import {EventEmitter} from 'events';

export default class ParkingDataInterval extends EventEmitter {
  private from: number;
  private to: number;
  private fetchedUris: string[];
  private fetchQueue: string[];
  private entry: string;
  private parking: string;

  constructor(from, to, entry, parking) {
    super();
    this.from = from;
    this.to = to;
    this.fetchedUris = [];
    this.entry = entry;
    this.parking = parking;
    this.fetchQueue = [entry];
  }

  public fetch() {
    const link = this.fetchQueue.pop();
    if (this.fetchedUris.indexOf(link) === -1) {
      console.log(link);
      this.fetchedUris.push(link);
      new ldfetch().get(link).then(response => {
        const store = new n3.Store(response.triples, {prefixes: response.prefixes});
        const timeframe = ParkingDataService.getMeasurements(this.parking, store);
        let hasOverlap = false;
        timeframe.forEach(measurement => {
          if (this.from <= measurement.timestamp && measurement.timestamp <= this.to) {
            (this as EventEmitter).emit('data', measurement);
            hasOverlap = true;
          }
        });
        if (hasOverlap) {
          const prevLinks = store.getTriples(null, 'hydra:previous');
          const nextLinks = store.getTriples(null, 'hydra:next');
          if (prevLinks.length > 0) {
            this.fetchQueue.push(prevLinks[0].object);
          }
          if (nextLinks.length > 0) {
            this.fetchQueue.push(nextLinks[0].object);
          }
        }
        this.fetch();
      });
    } else if (link !== undefined) {
      this.fetch();
    }
  }
}
