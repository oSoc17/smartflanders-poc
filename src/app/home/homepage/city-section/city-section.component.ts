import { ParkingDataService } from './../../services/parking-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-city-section',
  templateUrl: './city-section.component.html',
  styleUrls: ['./city-section.component.css']
})
export class CitySectionComponent implements OnInit {

  public cities: Array<string> = [];

  constructor(private parkingdataservice: ParkingDataService) { }

ngOnInit() {
  this.parkingdataservice.getDatasetUrls().then(parkingURLS => {
    for (let key in parkingURLS) {
      if (parkingURLS.hasOwnProperty(key)) {
        this.cities.push(parkingURLS[key])
      }
    }
  })
}

}

