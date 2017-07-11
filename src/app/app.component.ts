import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from './services/parking-data.service';
import n3 from 'n3';
import Parking from './models/parking';
import find from 'lodash/find';

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
    setInterval(this.getParkingData(), 30000);
  }

  private getParkings() {
    this.dataService.getParkings().then(parkings => {
      this.parkings = parkings;
    });
  }

private getParkingData() {
  this.dataService.get_data().then(result => {
    console.log(result);
      result.forEach(element => {
        const _parking = find(this.parkings, function(e){ return e.uri === element.subject});
        if (_parking) {
            _parking.currentVacantSpaces = this.N3Util.getLiteralValue(element.object);
        }
      });
    })
  }
}
