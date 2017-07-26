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
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.css'],
  providers: [ParkingDataService]
})

export class DetailspageComponent implements OnInit {

  public rangeData: Observable<any>;
  public clear = new EventEmitter();
  public parking: Parking;
  public measurement: Measurement;
  public intervalFetcher: ParkingDataInterval;
  public parkings: Array < Parking > = [];
  public cityUrl: string;
  public showDetailsPage = false;

  private timeFrame: TimestampRange;
  private isVacant = true;

  constructor(
    private _parkingDataService: ParkingDataService,
    private route: ActivatedRoute,
    private router: Router) {}

    onRangeChange($event) {
    this.timeFrame = $event;
    this.getData(this.timeFrame, this.parking, this.isVacant);
  }

  onDataTypeChange($event) {
    this.isVacant = $event;
    if (this.timeFrame) {
      this.getData(this.timeFrame, this.parking, this.isVacant);
    }
  }

  onCancel() {
    this.intervalFetcher.cancel();
    const clear = this.clear;
    setTimeout(function () {
      clear.emit();
    }, 15000);
  }

  ngOnInit() {
    this.isVacant = true;
    this.cityUrl = this.route.snapshot.paramMap.get('cityUrl');
    const id = this.route.snapshot.url[1].path;
    this._parkingDataService.getParkings(this.cityUrl).subscribe(
      (x) => {
        if (x.id === id) {
          this.parking = x;
          this.fetchData(x);
        }
      },
      (e) => {
        console.log('onError: %s', e);
      },
      () => { this.showDetailsPage = true;
        console.log(this.showDetailsPage);
      }
    )
  }
  fetchData(_parking) {
    const parking: Array<Parking> = [];
    parking.push(_parking);
    this._parkingDataService.getNewestParkingDataForCity(parking, this.cityUrl).subscribe(
      (x) => {   const result: Array <Measurement> = x[_parking.uri];
      this.measurement = result[result.length - 1]; },
      (e) => {},
      () => {  console.log(this.measurement) }
      );
  }

  getData(range: TimestampRange, parking: Parking, dataType: boolean) {
    const _this = this;
    if (dataType) {
      this.rangeData =  this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, this.cityUrl);
    } else {
      this.intervalFetcher = this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, this.cityUrl);
    }
  }
 }

