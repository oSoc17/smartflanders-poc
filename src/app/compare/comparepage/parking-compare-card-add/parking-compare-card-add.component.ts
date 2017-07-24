import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Parking from '../../../models/parking';
import { MaterializeAction } from 'angular2-materialize';
import ParkingChart from './../../../models/parking-chart';

@Component({
  selector: 'app-parking-compare-card-add',
  templateUrl: './parking-compare-card-add.component.html',
  styleUrls: ['./parking-compare-card-add.component.css']
})

export class ParkingCompareCardAddComponent implements OnInit {

  @Output() parkingAdded = new EventEmitter();
  @Output() parkingRemoved = new EventEmitter();
  @Input() public parkings: Parking[];

  public activeStatus: Array<boolean> = [];
  public modalActions = new EventEmitter<string|MaterializeAction>();

  constructor() { }

  ngOnInit() { }

  addParking(parkingId: string, activeStatus: boolean) {
    console.log(activeStatus);
    if (activeStatus) {
       this.parkingAdded.emit(parkingId);
    } else {
       this.parkingRemoved.emit(parkingId);
    }
  }

  openModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }
}
