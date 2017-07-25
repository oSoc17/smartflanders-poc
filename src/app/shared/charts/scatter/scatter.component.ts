import {Component, OnInit, Input, ViewChild} from '@angular/core';
import Parking from './../../../models/parking';
import Chart from 'chart.js';
import Measurement from './../../../models/measurement';
import ParkingHistory from './../../../models/parking-history';
import ParkingChart from './../../../models/parking-history';
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
  @Input() private isVacant;
  @Input() public parkingsChart;
  @ViewChild('scatter') scatter;

  private context;
  private parkingHistory: ParkingHistory;
  private chartData = [];
  private config;
  private chart;
  private updateIncoming = false;
  private counter = 0;

  constructor() { }

  ngOnInit() {
    console.log(this.parkingsChart);
    this.context = this.scatter.nativeElement;
    this.parkingHistory = new ParkingHistory(this.parking, []);
    this.config = {
      type: 'scatter',
      data: {
        datasets: this.parkingsChart
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
      this.updatePeriodically(d);
    });
    this.clear.subscribe(() => {
      this.chart.data.datasets.forEach(element => {
        console.log('scatter: clear', element);
        element.splice(0, element.length);
      });
      this.chart.update();
      console.log('cleared');
    })
  }


  updatePeriodically(measurement) {
    this.counter++;
    if (this.counter >= 20) {
      // this.parkingHistory.timeframe.splice(index, 0, d);
      console.log(this.chart.data);
      const parkingDataset = this.chart.data.datasets[measurement.parkingUri].data;
      console.log(measurement);
      const index = sortedLastIndexBy(parkingDataset, {
        x: (measurement.timestamp * 1000)
      }, function (o) {
        return o.x;
      });
      parkingDataset.splice(index, 0, {
        x: measurement.timestamp * 1000,
        y: parseInt(measurement.value, 10)
      });
      this.chart.update();
      this.counter = 0;
    }
  }
}

