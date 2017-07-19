import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from './services/parking-data.service';
import n3 from 'n3';
import Parking from './models/parking';

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
  }
}
