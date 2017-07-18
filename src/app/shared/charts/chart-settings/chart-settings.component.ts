import { EventEmitter } from 'events';
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.css']
})
export class ChartSettingsComponent implements OnInit {

  @Input() selected;

  constructor() { }

  ngOnInit() {
  }

}
