import {Component, OnInit, Input, ViewChild, OnDestroy} from '@angular/core';
import Parking from './../../../models/parking';
import Chart from 'chart.js';
import Measurement from './../../../models/measurement';
import ParkingHistory from './../../../models/parking-history';
import ParkingChart from './../../../models/parking-history';
import { sortedLastIndexBy, findIndex } from 'lodash';
import * as moment from 'moment';
import randomColor from 'randomcolor';
@Component({
  selector: 'app-chart-scatter-compare',
  templateUrl: './scatter-compare.component.html',
  styleUrls: ['./scatter-compare.component.css']
})

export class ScatterCompareComponent implements OnInit, OnDestroy {

  @Input() private data;
  @Input() private observables;
  @Input() private clear;
  @Input() private parkings: Array<Parking>;
  @Input() private isVacant;
  public parkingsChart = [];
  @ViewChild('scatter') scatter;
  private datasets = [];
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
        datasets: this.datasets
      },
      options: {
        legend: {
          display: true
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
              suggestedMax: 1000
            }
          }]
        }
      }
    };
    this.chart = new Chart(this.context, this.config);
    const _dthis = this;
    this.parkings.forEach(parking => {
      this.datasets.push({
          label: parking.uri,
          showLine: true,
          data: [],
          pointRadius: 1,
          pointStyle: 'line',
          backgroundColor: [
            randomColor(),
          ],
          borderColor: [
            randomColor(),
          ],
          borderWidth: 2
        })

    });
      this.chart.update();
    this.observables.forEach(element => {
      element.subscribe(
        (x) => {
          console.log(x);
         const indexOfDataset = findIndex(this.chart.data.datasets, (o) => { return o.label === x.parkingUrl});
        const index = sortedLastIndexBy(this.chart.data.datasets[indexOfDataset].data, {
       x: (x.timestamp * 1000)
    }, function (o) {
       return o.x;
     });
      this.chart.data.datasets[indexOfDataset].data.splice(0, 0, {
        x: x.timestamp * 1000,
        y: x.value
      });
      console.log(this.chart.data.datasets);
      this.chart.update();
        },
        (e) => {console.error(e)},
        ()  => {}
      )
    });
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

