import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Parking from '../../../models/parking';

@Component({
  selector: 'app-parking-compare-card-add',
  templateUrl: './parking-compare-card-add.component.html',
  styleUrls: ['./parking-compare-card-add.component.css']
})
export class ParkingCompareCardAddComponent implements OnInit {
   @Output() parkingAdded = new EventEmitter();
   @Output() parkingRemoved = new EventEmitter();
   @Input() private parkings: Parking[];
   activeStatus: Array<boolean> = [];

  constructor() { }

  ngOnInit() {
  }

  addParking(parkingId: string, activeStatus: boolean) {
    console.log(activeStatus);
    if (activeStatus) {
       this.parkingAdded.emit(parkingId);
    }
    else {
       this.parkingRemoved.emit(parkingId);
    }
  }


}
