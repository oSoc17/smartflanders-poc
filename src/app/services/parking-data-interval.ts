import { TriplesToMeasurements } from './../shared/helpers/TriplesToMeasurements';
import ldfetch from 'ldfetch';
import n3 from 'n3';
import {ParkingDataService} from './parking-data.service';
import {EventEmitter} from 'events';
import { Injectable } from '@angular/core';

@Injectable()
export class ParkingDataInterval extends EventEmitter {

  private from: number;
  private to: number;
  private fetchedUris: string[];
  private fetchQueue: string[];
  private entry: string;
  private parking: string;
  private canceled: boolean;
  private triplesToMeasurements = new TriplesToMeasurements();
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
    if (link !== undefined && this.fetchedUris.indexOf(link) === -1) {
      this.fetchedUris.push(link);
      new ldfetch().get(link).then(response => {
        this.fetchedUris.push(response.url);
        const timeframe = this.triplesToMeasurements.getMeasurements(response.triples, this.parking);
        let hasOverlap = false;
        timeframe.forEach(measurement => {
          if (this.from <= measurement.timestamp && measurement.timestamp <= this.to) {
            if (!this.canceled) {
              measurement.parkingUrl = this.parking;
              (this as EventEmitter).emit('data', measurement);
              hasOverlap = true;
            }
          }
        });
        if (!this.canceled && (hasOverlap || link === this.entry)) {
          const prevLinks = this.triplesToMeasurements.previous;
          if (prevLinks.length > 0 && prevLinks) {
            this.fetchQueue.push(prevLinks);
          }
        }
        this.fetch();
      });
    } else if (link !== undefined) {
      this.fetch();
    }
  }

  public cancel() {
    this.canceled = true;
    this.fetchQueue = [];
  }
}

