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
 dataservice: ParkingDataService;
 private measurement: Measurement;

  constructor(private _dataservice: ParkingDataService) {
    this.dataservice = _dataservice;
  }
  ngOnInit() {
    this.calculatePercentage();
    setInterval(() => {
      this.calculatePercentage();
    }, 30000);
  }

  private calculatePercentage() {
    Promise.all(this.dataservice.getNewestParkingData(this.parking.uri)).then(result => {
      result.forEach(element => {
        if (element) {
          this.measurement = element;
        }
      });
      //this.measurement = result ;
    });
  }


 

}
