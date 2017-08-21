import { Component, OnInit } from '@angular/core';
import { ParkingDataService } from '../../services/parking-data.service';
import Parking from './../../models/parking';
import { keys, values } from 'lodash';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  providers: [ParkingDataService],
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {

  parkings: Array<Parking> = [];
  public cities: Array<string> = [];
  public citynames: Array<string> = [];
  public selectedCountry: string;

  constructor (private _dataservice: ParkingDataService) {}

  ngOnInit() {
    this.selectedCountry = 'be';
    this._dataservice.getDatasetUrls().then(parkingURLS => {
      this.cities = values(parkingURLS);
      this.citynames = keys(parkingURLS);
    })
  }

  changeSelectedCountry(selectedCountry) {
    this.selectedCountry = selectedCountry.value;
  }
}


