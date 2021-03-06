import { MdButtonToggleModule } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import MaterialDateTimePicker from 'material-datetime-picker';
import TimestampRange from '../../../models/timestamp-range';
import * as Moment from 'moment';

@Component({
  selector: 'app-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.css']
})

export class ChartSettingsComponent implements OnInit {

  @Output() onRangeChange = new EventEmitter <TimestampRange> ();
  @Output() onDataTypeChange = new EventEmitter <boolean> ();
  @Output() onCancel = new EventEmitter();
  @Output() change = new EventEmitter();
  @Output() isVacant: boolean;

  public isAbsolute: boolean;
  public selectedTimeframe: string;
  public selectedData: string;
  public fromTimestamp: number;
  public toTimestamp: number;
  public picker: MaterialDateTimePicker;

  constructor() {}

  ngOnInit() {
    this.isAbsolute = true;
    this.selectedData = 'vacant';
    this.isVacant = true;
  }

  openTimePickerFrom(diff: string) {
    this.picker = new MaterialDateTimePicker();
    this.picker.open();
    this.picker.on('submit', (val) => {
      this.fromTimestamp = val.unix();
    })
  }

  openTimePickerTo(diff: string) {
    this.picker = new MaterialDateTimePicker();
    this.picker.open();
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

  changeIsAbsolute($event) {
    this.isAbsolute = $event.value === 'true';
    this.onDataTypeChange.emit($event.value === 'true');
  }

  changeSelectedTimeframe(selectedTimeframe) {
    this.selectedTimeframe = selectedTimeframe.value;
    if (this.selectedTimeframe !== 'custom') {
      this.toTimestamp = Moment().unix();
      this.fromTimestamp = Moment().subtract(1, selectedTimeframe.value).unix();
      this.updateRange();
    }
  }
}

