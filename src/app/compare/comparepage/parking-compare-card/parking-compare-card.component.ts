import { Component, OnInit, Input } from '@angular/core';
import Parking from '../../../models/parking';

@Component({
  selector: 'app-parking-compare-card',
  templateUrl: './parking-compare-card.component.html',
  styleUrls: ['./parking-compare-card.component.css']
})
export class ParkingCompareCardComponent implements OnInit {

  @Input() private data;
  @Input() private parking: Parking;
  @Input() private clear;

  constructor() { }

  ngOnInit() {
  }

}
