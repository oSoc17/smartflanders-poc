import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdCardModule} from '@angular/material';
import { ParkingDataService } from './../../services/parking-data.service';
import Parking from './../../models/parking';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  providers: [ParkingDataService],
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {
  /**
   * parkings
   */
  parkings: Array<Parking> = [];
  dataservice: ParkingDataService;

  constructor(
    private _dataservice:ParkingDataService,
    private router:Router
    ) {
    this.dataservice = _dataservice;
   }

  ngOnInit() {
    this.dataservice.getParkings().then(result => {
        this.parkings = result;
    });
  }
  goToDetails(parking:Parking){
    console.log(parking.id);
    this.router.navigate(['/parkings', parking.id]);
  }

}
