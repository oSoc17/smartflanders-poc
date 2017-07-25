import { Component, OnInit, Input } from '@angular/core';
import Parking from '../../../models/parking';
import ParkingChart from './../../../models/parking-chart';

@Component({
  selector: 'app-parking-compare-card',
  templateUrl: './parking-compare-card.component.html',
  styleUrls: ['./parking-compare-card.component.css']
})
export class ParkingCompareCardComponent implements OnInit {

  @Input() public data;
  @Input() public parking: Parking;
  @Input() public clear;
  @Input() public parkingsChart;

  constructor() { }

  ngOnInit() {
  }

}
