import { MdButtonToggleModule } from '@angular/material';
import { EventEmitter } from 'events';
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.css']
})
export class ChartSettingsComponent implements OnInit {

  @Output() change: EventEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  public changeSelectedType(selectedType) {
    console.log(selectedType.value);
  }

  public changeSelectedTimeframe(selectedTimeframe) {
    console.log(selectedTimeframe.value);
  }

}
