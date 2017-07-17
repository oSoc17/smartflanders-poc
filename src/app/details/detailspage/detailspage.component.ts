import TimestampRange from '../../models/timestamp-range';
import * as Rx from 'rxjs/Rx';
import {Component, EventEmitter, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { find } from 'lodash';
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
    private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this._parkingDataService.getParkings().then(result => {
      this.parking = find(result, function (o) {
        return o.id === id
      });
    }).then(() => {
      this._parkingDataService.getNewestParkingData(this.parking.uri).then(result => {
        this.measurement = new Measurement(result.timestamp, result.value);
      })
    })
  }

  getData(range: TimestampRange, parking: Parking) {
    console.log(range);
    this.clear.emit();
    const _this = this;
    this.intervalFetcher = this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, (data) => {
      _this.rangeData.next(data);
    });
    this.intervalFetcher.fetch();
  }
}

