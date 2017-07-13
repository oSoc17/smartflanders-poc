import { Component, OnInit } from '@angular/core';
import {ParkingDataService} from '../../services/parking-data.service';

@Component({
  selector: 'app-comparepage',
  templateUrl: './comparepage.component.html',
  styleUrls: ['./comparepage.component.css']
})
export class ComparepageComponent implements OnInit {

  data = {};
  parkings = [];

  constructor(private _parkingDataService: ParkingDataService) { }

  onRangeChange($event) {
    console.log($event);
  }

  ngOnInit() {
    this._parkingDataService.getParkings().then((parkings) => {
      parkings.forEach(parking => {
        this.parkings.push(parking);
      });
    })
  }

}
