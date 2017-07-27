import {Component, OnInit, Input, ViewChild, OnDestroy} from '@angular/core';
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

export class ScatterComponent implements OnInit, OnDestroy {

  @Input() private data;
  @Input() private clear;
  @Input() private parking: Parking;
  @Input() private isVacant;
  public parkingsChart = [];
  @ViewChild('scatter') scatter;
  private dataset = [];
  private context;
  private chartData = [];
  private config;
  public chart;
  private updateIncoming = false;
  private counter = 0;
  private disposable;

  constructor() { }

  ngOnInit() {
    this.context = this.scatter.nativeElement;
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
    const _dthis = this;
    this.disposable = this.data.subscribe(
      (x) => { _dthis.updatePeriodically(x)},
      (e) => { console.error(e)},
      () => { console.log('completed')}
    )
    this.clear.subscribe()
      this.chart.update();
  }
  ngOnDestroy() {
    this.disposable.unsubscribe();
  }


  updatePeriodically(measurement) {
    this.counter ++;
    if (this.counter >= 30 ) {
   const index = sortedLastIndexBy(this.chartData, {
        x: (measurement.timestamp * 1000)
      }, function (o) {
        return o.x;
      });
      this.chartData.splice(index, 0, {
        x: measurement.timestamp * 1000,
        y: measurement.value
      });
      this.counter = 0;
      this.chart.update();
    }
  }
}

