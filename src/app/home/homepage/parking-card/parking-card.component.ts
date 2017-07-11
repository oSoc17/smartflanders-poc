import { Component, OnInit, Input } from '@angular/core';
import {MdCardModule} from '@angular/material';
import Parking from './../../../models/parking'; 

@Component({
  selector: 'app-parking-card',
  templateUrl: './parking-card.component.html',
  styleUrls: ['./parking-card.component.css']
})
export class ParkingCardComponent implements OnInit {
 @Input() parking: Parking;
  constructor() { }

  ngOnInit() {
  }

}
