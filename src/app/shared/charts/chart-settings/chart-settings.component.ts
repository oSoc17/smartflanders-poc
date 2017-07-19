import { MdButtonToggleModule } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import MaterialDateTimePicker from 'material-datetime-picker';
import TimestampRange from '../../../models/timestamp-range';

@Component({
  selector: 'app-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.css']
})
export class ChartSettingsComponent implements OnInit {

  public selectedTimeframe: string;
  private selectedType;
  private fromTimestamp: number;
  private toTimestamp: number;
  private picker: MaterialDateTimePicker;

  @Output() onRangeChange = new EventEmitter<TimestampRange>();
  @Output() onCancel = new EventEmitter();
  @Output() change = new EventEmitter();

  constructor() { }

  ngOnInit() {

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

  public changeSelectedType(selectedType) {
    console.log(selectedType.value);
  }

  public changeSelectedTimeframe(selectedTimeframe) {
    console.log(selectedTimeframe.value);
    this.selectedTimeframe = selectedTimeframe.value;
    console.log(this.selectedTimeframe);
  }

}
