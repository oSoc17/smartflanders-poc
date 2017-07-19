import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdCardModule, MdProgressSpinnerModule} from '@angular/material';
import { ParkingDataService } from './../../services/parking-data.service';
import Parking from './../../models/parking';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  providers: [ParkingDataService],
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {

  parkings: Array<Parking> = [];
  dataservice: ParkingDataService;
  public cities: Array<string> = [];

  constructor(
    private _dataservice: ParkingDataService,
    private router: Router
    ) {
    this.dataservice = _dataservice;
   }

  ngOnInit() {
    this._dataservice.getDatasetUrls().then(parkingURLS => {
    for (let key in parkingURLS) {
      if (parkingURLS.hasOwnProperty(key)) {
        this.cities.push(parkingURLS[key])
      }
    }
  })
  }
  goToDetails(parking: Parking) {
    this.router.navigate(['/parkings', parking.id]);
  }
}
