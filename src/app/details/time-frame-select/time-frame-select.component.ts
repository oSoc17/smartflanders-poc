import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import TimestampRange from '../../models/timestamp-range';

@Component({
  selector: 'app-time-frame-select',
  templateUrl: './time-frame-select.component.html',
  styleUrls: ['./time-frame-select.component.css'],
})
export class TimeFrameSelectComponent implements OnInit {
  fromTimestamp: number;
  toTimestamp: number;
  @Output() onRangeChange = new EventEmitter<TimestampRange>();

  constructor() {
    this.fromTimestamp = moment().unix() - 3600;
    this.toTimestamp = moment().unix();
  }

  updateRange() {
    this.onRangeChange.emit({
      from: this.fromTimestamp,
      to: this.toTimestamp
    });
  }

  ngOnInit() {

  }
}
