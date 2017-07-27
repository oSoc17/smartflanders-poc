import { values } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input } from '@angular/core';
import {MdCardModule} from '@angular/material';
import Parking from './../../../models/parking';
import Measurement from './../../../models/measurement';
import { ParkingDataService } from './../../../services/parking-data.service';

@Component({
  selector: 'app-parking-card',
  templateUrl: './parking-card.component.html',
  styleUrls: ['./parking-card.component.css']
})
export class ParkingCardComponent implements OnInit {
 @Input() parking: Parking;
 @Input() measurements: Array <Measurement> = [];
 public values: Array<number> = [];
 dataservice: ParkingDataService;
  private up;

  constructor(private _dataservice: ParkingDataService) {
    this.dataservice = _dataservice;
  }
  ngOnInit() {
    if (this.measurements) {
      for (let index = 0; index < this.measurements.length; index++) {
       if (this.measurements[index].parkingUrl === this.parking.uri) {
         this.values.push(this.measurements[index].value)
       }
      }
    if (this.values[this.values.length - 1 ] >= this.values[this.values.length - 2 ]) {
      this.up = true;
     }
    }
  }

  private calculatePercentage() {
  }
}
