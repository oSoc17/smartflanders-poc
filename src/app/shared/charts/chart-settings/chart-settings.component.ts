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

  private selectedChart: string;
  private selectedTimeframe: string;
  private selectedData: string;
  private fromTimestamp: number;
  private toTimestamp: number;
  private picker: MaterialDateTimePicker;

  @Output() onRangeChange = new EventEmitter<TimestampRange>();
  @Output() onCancel = new EventEmitter();
  @Output() change = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.selectedChart = 'scatter';
    this.selectedData = 'vacant';
    this.selectedTimeframe = 'hour';
    this.toTimestamp = Moment().unix();
    // Argument of type '1' is not assignable to parameter of type 'DurationConstructor'
    // this.fromTimestamp = Moment().subtract(1, this.selectedTimeframe).unix();
    this.updateRange();
  }

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

  public changeSelectedChart(selectedChart) {
    this.selectedChart = selectedChart.value;
  }

  public changeSelectedTimeframe(selectedTimeframe) {
    this.selectedTimeframe = selectedTimeframe.value;
    if (this.selectedTimeframe !== 'custom') {
      this.toTimestamp = Moment().unix();
      this.fromTimestamp = Moment().subtract(1, selectedTimeframe.value).unix();
      this.updateRange();
    }
  }

  public changeSelectedData(selectedData) {
    this.changeSelectedData = selectedData.value;
  }

}
