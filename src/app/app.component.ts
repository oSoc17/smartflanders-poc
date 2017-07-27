import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from './services/parking-data.service';
import Parking from './models/parking';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor() {
  }

}
