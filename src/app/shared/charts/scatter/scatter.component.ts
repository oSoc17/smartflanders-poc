import {Component, OnInit, Input, ViewChild} from '@angular/core';
import Parking from './../../../models/parking'
import Chart from 'chart.js';
import Measurement from './../../../models/measurement';
import ParkingHistory from './../../../models/parking-history'
import { sortedLastIndexBy } from 'lodash';
import { sortedArray } from 'sorted-array';
@Component({
  selector: 'app-chart-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.css']
})
export class ScatterComponent implements OnInit {
  @Input() private data;
  @Input() private parking: Parking;
  @ViewChild('scatter') scatter;
  private context;
  private parkingHistory: ParkingHistory;
  private chartData = [];
  private config;
  private chart;

  constructor() {
  }

  ngOnInit() {
    this.context = this.scatter.nativeElement;
    this.parkingHistory = new ParkingHistory(this.parking, []);
    this.config = {
      type: 'scatter',
      data: {
        datasets: [{
          label: '',
          showLine: true,
          data: this.chartData,
          pointRadius: 1,
          pointStyle: 'line',
          backgroundColor: [
            '#e1f5fe',
          ],
          borderColor: [
            '#4fc3f7',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          xAxes: [{
            ticks: {
              display: true
            }
          }]
        }
      }
    };
    this.chart = new Chart(this.context, this.config);
    this.data.subscribe(d => {
      const index = sortedLastIndexBy(this.chartData, {x: d.timestamp, y: parseInt(d.value, 10)}, function(o) { return o.x; });
      console.log(index);
      this.chartData.splice(index , 0, {x: d.timestamp, y: parseInt(d.value, 10)});
      this.parkingHistory.timeframe.splice(index, 0, d);
      this.chart.update();
    });
  }
}
