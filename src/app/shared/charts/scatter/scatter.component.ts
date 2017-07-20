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
  private updateIncoming = false;
  private counter = 0;

  constructor() {
  }

  ngOnInit() {
    this.context = this.scatter.nativeElement;
    this.parkingHistory = new ParkingHistory(this.parking, []);
    this.config = {
       animation: false,
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Vacant spaces',
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
          borderWidth: 2
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
              labelString: 'Spots'
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
      this.updatePeriodically(d);
    });
    this.clear.subscribe(() => {
      this.chartData.splice(0, this.chartData.length);
      this.chart.update();
      console.log('cleared');
    })
  }


  updatePeriodically(d) {
    this.counter ++;
    console.log(this.counter);
    if ( this.counter >= 20) {
      //this.parkingHistory.timeframe.splice(index, 0, d);
      this.chart.data.datasets.forEach(element => {
        const index = sortedLastIndexBy(element, {x: (d.timestamp * 1000)}, function(o) { return o.x; });
        element.data.splice(index, 0, {x: d.timestamp * 1000, y: parseInt(d.value, 10)});
      });
      this.chart.update(0);
      this.counter = 0;
    }
  }
}
