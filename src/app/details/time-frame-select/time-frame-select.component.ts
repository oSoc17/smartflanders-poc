import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-time-frame-select',
  templateUrl: './time-frame-select.component.html',
  styleUrls: ['./time-frame-select.component.css'],
})
export class TimeFrameSelectComponent implements OnInit {
  fromTimestamp: number;
  toTimestamp: number;

  constructor() {}

  ngOnInit() {

  }
}
