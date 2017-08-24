import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ParkingDataService } from '../../services/parking-data.service';
import { find, indexOf, values } from 'lodash';
import Parking from './../../models/parking';
import * as Rx from 'rxjs/Rx';
import { ScatterComponent } from '../../shared/charts/scatter/scatter.component';


@Component({
  selector: 'app-comparepage',
  templateUrl: './comparepage.component.html',
  styleUrls: ['./comparepage.component.css']
})

export class ComparepageComponent implements OnInit {

  @ViewChild(ScatterComponent)
  private scatter: ScatterComponent;
  public data = {};
  public parkings: Array<Parking> = [];
  public parkingsToCompare: Array<Parking> = [];
  public parkingsChart;
  public emitter = new EventEmitter<string>();
  public intervalFetchers = {};
  public observables = [];
  public showChart = false;
  public eIsAbsolute = new EventEmitter<boolean>();
  public isAbsolute = true;
  private range;
  private datasets;

  constructor(private _parkingDataService: ParkingDataService) { }

  onRangeChange($event) {
    if (Object.keys(this.intervalFetchers).length !== 0) {
      this.onCancel();
    }
    this.getData($event);
    this.range = $event;
  }

  ngOnInit() {
    this.parkingsChart = [];
    this._parkingDataService.getDatasetUrls().then(result => {
      this.datasets = result;
      values(result).forEach(city => {
        this._parkingDataService.getParkings(city).subscribe(
          (parkings) => {this.parkings.push(parkings)},
          (e) => {console.log('error', e)},
          () => {}
        );
      })
    });
  }

  getData(range) {
    this.emitter.emit('clearGraph');
    this.observables.splice(0, this.observables.length);
    for (let index = 0; index < this.parkingsToCompare.length; index++) {
      const parking = this.parkingsToCompare[index];
      const obs = this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, parking.cityUrl);
      this.observables.push(obs);
    }
    this.showChart = true;
    this.emitter.emit('observablesChanged');
  }

  onCancel() {
    Object.keys(this.intervalFetchers).forEach((uri) => {
      const interval = this.intervalFetchers[uri];
      interval.cancel();
    });
    this.emitter.emit('clearGraph');
    this.intervalFetchers = {};
  }

  onDataTypeChange(value) {
    this.eIsAbsolute.emit(value);
    this.isAbsolute = value;
  }

  parkingRemovedHandler(parkingID) {
    const parkingToRemove = find(this.parkings, function (o) {
      return o.id === parkingID;
    });
    this.parkingsToCompare.splice(indexOf(this.parkingsToCompare, parkingToRemove), 1);
    if (this.range !== undefined) {
      this.emitter.emit('parkingsChanged');
      this.getData(this.range);
    }
  }

  parkingAddedHandler(parkingID) {
    const _parking = find(this.parkings, o => o.id === parkingID);
    console.log(_parking);
    this.parkingsToCompare.push(_parking);
    this.data[_parking.uri] = new Rx.Subject();
    if (this.range !== undefined) {
      this.emitter.emit('parkingsChanged');
      this.getData(this.range);
    }
  }
}
