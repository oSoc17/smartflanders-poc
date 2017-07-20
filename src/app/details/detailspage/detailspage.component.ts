import { element } from 'protractor';
import TimestampRange from '../../models/timestamp-range';
import * as Rx from 'rxjs/Rx';
import {Component, EventEmitter, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { findLast } from 'lodash';
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
  private rangeData = new Rx.Subject();
  private clear = new EventEmitter();
  private parking: Parking;
  private measurement: Measurement;
  private intervalFetcher: ParkingDataInterval;
  private parkings: Array<Parking> = [];
  private cityUrl: string;

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
  const id = this.route.snapshot.paramMap.get('parkingid');
  this._parkingDataService.getParkings(this.cityUrl).then(result => {
         this.parkings = result;
    }).then( () => {
    this.parkings.forEach(p => {
        if (p.id === id) {
          this.parking = p;
        }
      })
  }).then(() => {
    this._parkingDataService.getNewestParkingData(this.parking.uri, this.cityUrl).then(result => {
      console.log(result);
    });
  })
}

getData(range: TimestampRange, parking: Parking) {
  console.log(range);
  this.clear.emit();
  const _this = this;
  this.intervalFetcher = this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, (data) => {
    _this.rangeData.next(data);
  }, this.cityUrl);
  this.intervalFetcher.fetch();
}
}

