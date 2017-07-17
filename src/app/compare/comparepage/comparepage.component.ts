import {
  Component,
  OnInit,
  EventEmitter
} from '@angular/core';
import {
  ParkingDataService
} from '../../services/parking-data.service';
import * as Rx from 'rxjs/Rx';
import {
  find,
  indexOf
} from 'lodash';

@Component({
  selector: 'app-comparepage',
  templateUrl: './comparepage.component.html',
  styleUrls: ['./comparepage.component.css']
})
export class ComparepageComponent implements OnInit {

  data = {};
  parkings = [];
  parkingToCompare = [];
  clear = new EventEmitter();
  intervalFetchers = {};

  constructor(private _parkingDataService: ParkingDataService) {}

  onRangeChange($event) {
    this.getData($event);
  }

  ngOnInit() {
    this._parkingDataService.getParkings().then((parkings) => {
      parkings.forEach(parking => {
        this.parkings.push(parking);
        this.data[parking.uri] = new Rx.Subject();
      });
      console.log(this.data);
    })
  }

  getData(range) {
    this.clear.emit();
    this.parkingToCompare.forEach(parking => {
      this.intervalFetchers[parking] = this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, data => {
        this.data[parking.uri].next(data);
      });
      this.intervalFetchers[parking].fetch();
    });
  }

  onCancel() {
    Object.keys(this.intervalFetchers).forEach((parking) => {
      const interval = this.intervalFetchers[parking];
      interval.cancel();
    })
  }

  parkingRemovedHandler(parkingID) {
    const _parking = find(this.parkings, function (o) {
      return o.id === parkingID;
    });
    this.parkingToCompare.splice(indexOf(this.parkingToCompare, _parking), 1);
  }
  parkinghandler(parkingID) {
    const _parking = find(this.parkings, function (o) {
      return o.id === parkingID;
    });
    if (this.parkingToCompare.indexOf(_parking) === -1) {
      this.parkingToCompare.push(_parking);
    }
  }
}
