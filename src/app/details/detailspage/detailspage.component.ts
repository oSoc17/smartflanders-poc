import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { find } from 'lodash';
import { ParkingDataService } from './../../services/parking-data.service';
import Parking from './../../models/parking'
import Measurement from './../../models/measurement';

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.css']
})

export class DetailspageComponent implements OnInit {
  private parking: Parking;
  private measurement: Measurement;

  constructor(
    private _parkingDataService: ParkingDataService,
    private route: ActivatedRoute,
    private router: Router) 
    { }

  ngOnInit() {
      let id = this.route.snapshot.paramMap.get('id');
      this._parkingDataService.getParkings().then(result => {
      this.parking = find(result, function (o) {
        return o.id == id
      });
    }).then(() => {
      this._parkingDataService.getNewestParkingData(this.parking.uri).then(result => {
        this.measurement = new Measurement(result.timestamp, result.value); 
      })
    })

  }
}

