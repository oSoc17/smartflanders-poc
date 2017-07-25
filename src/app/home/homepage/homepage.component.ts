import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { MdCardModule, MdProgressSpinnerModule} from '@angular/material';
import { ParkingDataService } from './../../services/parking-data.service';
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
  dataservice: ParkingDataService;
  public cities: Array<string> = [];
  public citynames: Array<string> = [];
  public selectedCountry: string;

  constructor(
    private _dataservice: ParkingDataService
    ) {
    this.dataservice = _dataservice;
   }

  ngOnInit() {
    this.selectedCountry = 'be';
    this._dataservice.getDatasetUrls().then(parkingURLS => {
      console.log(parkingURLS);
      this.cities = values(parkingURLS);
      this.citynames = keys(parkingURLS);
    })
  }
  }

