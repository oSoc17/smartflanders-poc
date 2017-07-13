import TimestampRange from '../../models/timestamp-range';
import * as Rx from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { find } from 'lodash';
import { ParkingDataService } from '../../services/parking-data.service';
import Parking from './../../models/parking'
import Measurement from './../../models/measurement';

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.css'],
  providers: [ParkingDataService]
})

export class DetailspageComponent implements OnInit {
  private rangeData = new Rx.Subject();
  private parking: Parking;
  private measurement: Measurement;

  onRangeChange($event) {
    this.getData($event);
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

  getData(range: TimestampRange) {
    const _this = this;
    console.log('WHYY??');
    this._parkingDataService.getParkingHistory('https://stad.gent/id/parking/P10', range.from, range.to, (data) => {
       console.log(data);
      _this.rangeData.next(data);
    });
  }
}

