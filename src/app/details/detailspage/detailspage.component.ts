import { element } from 'protractor';
import TimestampRange from '../../models/timestamp-range';
import * as Rx from 'rxjs/Rx';
import { Component, EventEmitter, OnInit } from '@angular/core';
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
  public rangeData = new Rx.Subject();
  public clear = new EventEmitter();
  public parking: Parking;
  public measurement: Measurement;
  public intervalFetcher: ParkingDataInterval;
  public parkings: Array<Parking> = [];
  public cityUrl: string;

  private timeFrame;
  private isVacant;

  onRangeChange($event) {
    this.timeFrame = $event;
    this.getData(this.timeFrame, this.parking, this.isVacant);
  }

  onDataTypeChange($event) {
    console.log($event);
    this.isVacant = $event;
    if (this.timeFrame) {
      this.getData(this.timeFrame, this.parking, this.isVacant);
    }
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
  this.isVacant = true;
  this.cityUrl = this.route.snapshot.paramMap.get('cityUrl');
  const id = this.route.snapshot.url[1].path;
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
      this.measurement = result;
      console.log(result);
    });
  })
}

getData(range: TimestampRange, parking: Parking, dataType: boolean) {
  this.clear.emit();
  const _this = this;
  if (dataType) {
    this.intervalFetcher = this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, (data) => {
      console.log(data.value);
      _this.rangeData.next(data);
    }, this.cityUrl);
  } else {
    this.intervalFetcher = this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, (data) => {
      data.value = parking.totalSpaces - data.value;
      console.log(data.value);
      _this.rangeData.next(data);
    }, this.cityUrl);
  }
  this.intervalFetcher.fetch();
}
}

