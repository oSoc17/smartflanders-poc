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
  indexOf,
  values
} from 'lodash';
import Parking from './../../models/parking'


@Component({
  selector: 'app-comparepage',
  templateUrl: './comparepage.component.html',
  styleUrls: ['./comparepage.component.css']
})
export class ComparepageComponent implements OnInit {

  data = {};
  parkings: Array<Parking> = [];
  parkingToCompare = [];
  clear = new EventEmitter();
  intervalFetchers = {};
  constructor(private _parkingDataService: ParkingDataService) {}

  onRangeChange($event) {
    if (Object.keys(this.intervalFetchers).length !== 0) {
      this.onCancel();
    }
    this.getData($event);
  }

  ngOnInit() {
    this._parkingDataService.getDatasetUrls().then(result => {
      values(result).forEach(city => {
        this._parkingDataService.getParkings(city).subscribe(parkings => {
          this.parkings.push.apply(this.parkings, parkings);
        });
      });
    });
  }


  getData(range) {
    this.clear.emit();
    this.parkingToCompare.forEach(parking => {
      this.intervalFetchers[parking.uri] = this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, data => {
        this.data[parking.uri].next(data);
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
    this.data[_parking.uri] = new Rx.Subject();
  }

}
