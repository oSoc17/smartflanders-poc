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
  @Input() private emitter;
  @Input() private parking: Parking;
  @Input() private isVacant;
  @Input() private datapointGap;
  @ViewChild('scatter') scatter;
  private context;
  private chartData = [];
  private config;
  public chart;
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
        tooltips: {
          enabled: true,
          callbacks: {
            label: (item) => {
              const ts = moment(item.xLabel).format('YYYY-MM-DDTHH:mm:ss');
              return ts + ': ' + item.yLabel + ' spaces';
            }
          }
        },
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
    this.refreshObservable(this.data);
    this.emitter.subscribe(e => {
      switch (e.event) {
        case 'clearGraph':
          this.clearGraph(); break;
        case 'observableChanged':
          this.refreshObservable(e.data); break;
      }
    });
    this.chart.update();
  }

  clearGraph() {
    console.log('clearing graph');
    this.disposable.unsubscribe();
    this.chart.data.datasets.forEach(ds => {
      ds.data.splice(0, ds.data.length);
    });
    this.chart.update();
  }

  refreshObservable(data) {
    console.log('refreshing observable');
    if (this.disposable !== undefined) {
      this.disposable.unsubscribe();
    }
    this.data = data;
    this.disposable = this.data.subscribe(
      (measurement) => {
        this.counter++;
        if (this.counter >= this.datapointGap) {
          this.chartData.splice(0, 0, {
            x: measurement.timestamp * 1000,
            y: measurement.value
          });
          this.counter = 0;
          this.chart.update();
        }},
      (e) => {console.error(e)},
      () => {console.log('completed')}
    );
  }

  ngOnDestroy() {
    this.disposable.unsubscribe();
  }
}

