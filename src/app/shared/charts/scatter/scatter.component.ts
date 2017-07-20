import {Component, OnInit, Input, ViewChild} from '@angular/core';
import Parking from './../../../models/parking'
import Chart from 'chart.js';
import Measurement from './../../../models/measurement';
import ParkingHistory from './../../../models/parking-history'
import { sortedLastIndexBy } from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'app-chart-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.css']
})
export class ScatterComponent implements OnInit {
  @Input() private data;
  @Input() private clear;
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
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'hour',
              displayFormats: {
                hour: 'MMM D, HH:mm'
              },
              parse: (value) => moment.unix(value).toISOString(),
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Parking spots'
            },
            ticks: {
              beginAtZero: true,
              suggestedMin: 50,
              suggestedMax: this.parking.totalSpaces
            }
          }]
        }
      }
    };
    this.chart = new Chart(this.context, this.config);
    this.data.subscribe(d => {
      const index = sortedLastIndexBy(this.chartData, {x: d.timestamp, y: parseInt(d.value, 10)}, function(o) { return o.x; });
      this.chartData.splice(index , 0, {x: d.timestamp * 1000, y: parseInt(d.value, 10)});
      this.parkingHistory.timeframe.splice(index, 0, d);
      this.chart.update();
      console.log('updated');
    });
    this.clear.subscribe(() => {
      this.chartData.splice(0, this.chartData.length);
      this.chart.update();
      console.log('cleared');
    })
  }
}
