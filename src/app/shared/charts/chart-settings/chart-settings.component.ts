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

  changeSelectedChart(selectedChart) {
    this.selectedChart = selectedChart.value;
  }

  changeSelectedTimeframe(selectedTimeframe) {
    this.selectedTimeframe = selectedTimeframe.value;
    if (this.selectedTimeframe !== 'custom') {
      this.toTimestamp = Moment().unix();
      this.fromTimestamp = Moment().subtract(1, selectedTimeframe.value).unix();
      this.updateRange();
    }
  }

  changeSelectedData(selectedData) {
    this.changeSelectedData = selectedData.value;
  }

}
