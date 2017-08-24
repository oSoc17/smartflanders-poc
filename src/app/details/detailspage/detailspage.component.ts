import TimestampRange from '../../models/timestamp-range';
import { Component, EventEmitter, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  providers: []
})

export class DetailspageComponent implements OnInit {

  public rangeData: Observable<any>;
  public emitter = new EventEmitter();
  public parking: Parking;
  public measurement: Measurement;
  public intervalFetcher: ParkingDataInterval;
  public parkings: Array < Parking > = [];
  public cityUrl: string;
  public showDetailsPage = false;
  public eIsAbsolute = new EventEmitter<boolean>();
  public isAbsolute = true;

  private timeFrame: TimestampRange;
  private isVacant = true;

  constructor(
    private _parkingDataService: ParkingDataService,
    private route: ActivatedRoute,
    private zone: NgZone) {}

  onRangeChange($event) {
    this.timeFrame = $event;
    this.getData(this.timeFrame, this.parking, this.isVacant);

  }

  onDataTypeChange(value) {
    this.eIsAbsolute.emit(value);
    this.isAbsolute = value;
  }

  onCancel() {
    this.intervalFetcher.cancel();
    const emitter = this.emitter;
    setTimeout(function () {
      emitter.emit({event: 'clearGraph'});
    }, 15000);
  }

  ngOnInit() {
    this.isVacant = true;
    this.cityUrl = this.route.snapshot.paramMap.get('cityUrl');
    const id = this.route.snapshot.url[1].path;
    const result = [];
    this._parkingDataService.getParkings(this.cityUrl).filter(x => x.id === id).subscribe(
      (parking) => {
        this.zone.run(() => {this.parking = parking});
        this._parkingDataService.getNewestParkingDataForOne(this.parking.uri, this.parking.cityUrl).subscribe(
          (measurement) => {
            result.push(measurement);
            this.zone.run(() => this.measurement = measurement) },
          (error) => {console.log('error', error)},
          () => { this.measurement = result[result.length - 1 ]; setTimeout( () => {this.showDetailsPage = true}, 1000) ; }
        );
      },
      (e) => { console.log('onError: %s', e) },
      () => { }
    )
  }
  getData(range: TimestampRange, parking: Parking, dataType: boolean) {
    if (dataType) {
      this.emitter.emit({event: 'clearGraph'});
      this.rangeData = this._parkingDataService.getParkingHistory(parking.uri, range.from, range.to, this.cityUrl);
      this.emitter.emit({event: 'observableChanged', data: this.rangeData});
    }
  }
 }
