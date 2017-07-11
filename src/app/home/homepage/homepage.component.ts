import { Component, OnInit } from '@angular/core';
import { MdCardModule} from '@angular/material';
import { DataService } from './../../services/data.service';
import Parking from './../../models/parking'; 

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  providers: [DataService],
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {
  /**
   * parkings
   */
  parkings: Array<Parking> = [];
  dataservice: DataService;

  constructor(private _dataservice:DataService) {
    this.dataservice = _dataservice;

   }

  ngOnInit() {
    this.dataservice.getParkings().then(result => {
        this.parkings = result;
    });
  }

}
