import { values } from 'lodash';
import { Observable } from 'rxjs/observable';
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
 @Input() cityUrl: string;
 @Input() measurements: any;
 public values: Array<number>;
 dataservice: ParkingDataService;
 private measurement: Measurement;

  constructor(private _dataservice: ParkingDataService) {
    this.dataservice = _dataservice;
  }
  ngOnInit() {
     setTimeout( () => { this.values = this.measurements[this.parking.uri].values}, 2000);
  }

  private calculatePercentage() {
  }
}
