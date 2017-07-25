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
 dataservice: ParkingDataService;
 private measurement: Measurement;

  constructor(private _dataservice: ParkingDataService) {
    this.dataservice = _dataservice;
  }
  ngOnInit() {
     setTimeout( () => {console.log(this.measurements[this.parking.uri])}, 1000);
  }

  private calculatePercentage() {
  }
}
