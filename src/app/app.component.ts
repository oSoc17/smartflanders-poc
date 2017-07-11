import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from './services/parking-data.service';
import n3 from 'n3';
import Parking from './models/parking';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public parkings: Array<Parking> = [];
  private dataService: ParkingDataService;
  private N3Util;

  constructor(dataService: ParkingDataService) {
    this.dataService = dataService;
  }

  ngOnInit() {
    this.N3Util = n3.Util;
    this.getParkings();
    const now = moment().unix();
    this.dataService.getParkingHistory('https://stad.gent/id/parking/P10', now - 3600, now, (data) => {
      console.log(data);
    });
  }

  private getParkings() {
    this.dataService.getParkings().then(parkings => {
      this.parkings = parkings;
    });
  }
}
