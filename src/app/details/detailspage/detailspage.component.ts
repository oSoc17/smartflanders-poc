import { Observable } from 'rxjs/Observable';
import { element } from 'protractor';
import TimestampRange from '../../models/timestamp-range';
import * as Rx from 'rxjs/Rx';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { findLast, values } from 'lodash';
import { ParkingDataService } from '../../services/parking-data.service';
import Parking from './../../models/parking'
import Measurement from './../../models/measurement';
import {ParkingDataInterval} from '../../services/parking-data-interval';

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.css'],
  providers: [ParkingDataService]
})

export class DetailspageComponent implements OnInit {
  public rangeData = new Observable();
  public clear = new EventEmitter();
  public parking: Parking;
  public measurement: Measurement;
  public intervalFetcher: ParkingDataInterval;
  public parkings: Array<Parking> = [];
  public cityUrl: string;

  onRangeChange($event) {
    this.getData($event, this.parking);
  }

  onCancel() {
    this.intervalFetcher.cancel();
    const clear = this.clear;
    setTimeout(function() {
      clear.emit();
    }, 1000);
  }
constructor(
  private _parkingDataService: ParkingDataService,
  private route: ActivatedRoute,
  private router: Router) {}

ngOnInit() {
  this.cityUrl = this.route.snapshot.paramMap.get('cityUrl');
  const id = this.route.snapshot.url[1].path;
  this._parkingDataService.getParkings(this.cityUrl).then(result => {
         this.parkings = result;
    }).then(() => {
    this.parkings.forEach(p => {
        if (p.id === id) {
          this.parking = p;
        }
      })
  }).then(() => {
    this._parkingDataService.getNewestParkingData(this.parking.uri, this.cityUrl).then(result => {
      this.measurement = result;
      console.log(result);
    });
  })
}

getData(range: TimestampRange, parking: Parking) {
  this.clear.emit();
  this.rangeData = this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, this.cityUrl);
  console.log(this.rangeData);
}
}

