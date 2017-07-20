import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import TimestampRange from '../../models/timestamp-range';
import {MdButtonModule, MdInputModule } from '@angular/material';
import MaterialDateTimePicker from 'material-datetime-picker';

@Component({
  selector: 'app-time-frame-select',
  templateUrl: './time-frame-select.component.html',
  styleUrls: ['./time-frame-select.component.css'],
})
export class TimeFrameSelectComponent implements OnInit {

  public fromTimestamp: number;
  public toTimestamp: number;
  public picker: MaterialDateTimePicker;

  @Output() onRangeChange = new EventEmitter <TimestampRange> ();
  @Output() onCancel = new EventEmitter();

  constructor() {}

  openTimePickerFrom(diff: string) {
    this.picker = new MaterialDateTimePicker();
    this.picker.open()
    this.picker.on('submit', (val) => {
      this.fromTimestamp = val.unix();
    })
  }

  openTimePickerTo(diff: string) {
    this.picker = new MaterialDateTimePicker();
    this.picker.open()
    this.picker.on('submit', (val) => {
      this.toTimestamp = val.unix();
    })
  }

  updateRange() {
    this.onRangeChange.emit({
      from: this.fromTimestamp,
      to: this.toTimestamp
    });
  }

  cancel() {
    this.onCancel.emit();
  }

  ngOnInit() {

  }
}

