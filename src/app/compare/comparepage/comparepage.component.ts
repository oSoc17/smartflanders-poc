import { Component, OnInit } from '@angular/core';
import {ParkingDataService} from '../../services/parking-data.service';
import * as Rx from 'rxjs/Rx';
import { find, indexOf } from 'lodash';

@Component({
  selector: 'app-comparepage',
  templateUrl: './comparepage.component.html',
  styleUrls: ['./comparepage.component.css']
})
export class ComparepageComponent implements OnInit {

  data = {};
  parkings = [];
  parkingToCompare = [];

  constructor(private _parkingDataService: ParkingDataService) { }

  onRangeChange($event) {
    this.getData($event);
  }

  ngOnInit() {
    this._parkingDataService.getParkings().then((parkings) => {
      parkings.forEach(parking => {
        this.parkings.push(parking);
        this.data[parking.uri] = new Rx.Subject();
      });
    })
  }

  getData(range) {
    this.parkings.forEach(parking => {
      this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, data => {
        this.data[parking.uri].next(data);
      })
    })
  }
parkingRemovedHandler(parkingID) {
  let _parking = find(this.parkings, function(o) { return o.id === parkingID; });
  this.parkingToCompare.splice(indexOf(this.parkingToCompare, _parking), 1);
}
  parkinghandler(parkingID) {
    let _parking = find(this.parkings, function(o) { return o.id === parkingID; });
    if (this.parkingToCompare.indexOf(_parking) === -1) {
         this.parkingToCompare.push(_parking);
    }
  }
}
