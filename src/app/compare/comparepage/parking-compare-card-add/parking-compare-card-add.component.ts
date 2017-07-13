import { Component, OnInit, Input } from '@angular/core';
import Parking from '../../../models/parking';

@Component({
  selector: 'app-parking-compare-card-add',
  templateUrl: './parking-compare-card-add.component.html',
  styleUrls: ['./parking-compare-card-add.component.css']
})
export class ParkingCompareCardAddComponent implements OnInit {

  @Input() private parkings: Parking[];

  constructor() { }

  ngOnInit() {
  }

}
