import { Component, OnInit, EventEmitter } from '@angular/core';
import { ParkingDataService } from '../../services/parking-data.service';
import { find, indexOf, values } from 'lodash';
import Parking from './../../models/parking';
import ParkingChart from './../../models/parking-chart';
import * as Rx from 'rxjs/Rx';

@Component({
  selector: 'app-comparepage',
  templateUrl: './comparepage.component.html',
  styleUrls: ['./comparepage.component.css']
})

export class ComparepageComponent implements OnInit {

  public data = {};
  public parkings: Array<Parking> = [];
  public parkingsToCompare: Array<Parking> = [];
  public parkingsChart;
  public clear = new EventEmitter();
  public intervalFetchers = {};

  constructor(private _parkingDataService: ParkingDataService) { }

  onRangeChange($event) {
    if (Object.keys(this.intervalFetchers).length !== 0) {
      this.onCancel();
    }
    console.log($event);
    this.getData($event);
  }

  ngOnInit() {
    this.parkingsChart = new Array();
    this._parkingDataService.getDatasetUrls().then(result => {
      values(result).forEach(city => {
        this._parkingDataService.getParkings(city).subscribe(parkings => {
          this.parkings.push(parkings);
        });
      });
    });
  }

  getData(range) {
    this.clear.emit();
    this.parkingsToCompare.forEach(parking => {
      this.intervalFetchers[parking.uri] = this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, data => {
        console.log(data);
        this.data[parking.uri].next(data);
        this.parkingsChart[parking.uri].next(data);
      }, parking.cityUrl);
      this.intervalFetchers[parking.uri].fetch();
    });
  }

  onCancel() {
    Object.keys(this.intervalFetchers).forEach((uri) => {
      const interval = this.intervalFetchers[uri];
      interval.cancel();
    });
    this.clear.emit();
    this.intervalFetchers = {};
  }

  parkingRemovedHandler(parkingID) {
    const parkingToRemove = find(this.parkings, function (o) {
      return o.id === parkingID;
    });
    this.parkingsToCompare.splice(indexOf(this.parkingsToCompare, parkingToRemove), 1);
  }

  parkinghandler(parkingID) {
    const _parking = find(this.parkings, function (o) {
      return o.id === parkingID;
    });
    if (this.parkingsToCompare.indexOf(_parking) === -1) {
      this.data[_parking.uri] = new Rx.Subject();
      this.parkingsToCompare.push(_parking);
      console.log(this.data[_parking.uri]);
      this.parkingsChart[_parking.uri] = new ParkingChart(_parking.name, this.data[_parking.uri], '#552356');
    }
    this.data[_parking.uri] = new Rx.Subject();
  }
}
