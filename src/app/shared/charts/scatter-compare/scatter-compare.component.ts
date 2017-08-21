import { Observable } from 'rxjs/Observable';
import {Component, OnInit, Input, ViewChild, OnDestroy, EventEmitter} from '@angular/core';
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
  @Input() private observables; // Array of observables used to stream the parking data
  @Input() private emitter: EventEmitter<string>;
  @Input() private parkings: Array < Parking > ;
  @Input() private isVacant;
  @ViewChild('scatter') scatter;
  private datasets = [];
  private context;
  private config;
  public chart;
  private disposable = [];
  private counters: Array<number> = [];

  constructor() {}

  ngOnInit() {
    this.context = this.scatter.nativeElement;
    this.config = {
      animation: false,
      type: 'scatter',
      data: { datasets: this.datasets },
      options: {
        legend: { display: true },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'hour',
              displayFormats: { hour: 'MMM D, HH:mm' },
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
    this.refreshParkings();
    this.chart.update();
    this.refreshObservables();
    this.emitter.subscribe(e => {
      switch (e) {
        case 'clearGraph':
          this.clearGraph(); break;
        case 'refreshParkings':
          this.refreshParkings(); break;
        case 'refreshObservables':
          this.refreshObservables(); break;
      }
    });
  }

  clearGraph() {
    console.log('clearing graph');
  }

  refreshParkings() {
    this.datasets = [];
    const hues = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
    let iHue = 0;
    this.parkings.forEach(parking => {
      const hue = hues[iHue];
      iHue = iHue === hues.length - 1 ? 0 : iHue + 1;
      this.datasets.push({
        fill: false,
        label: parking.name,
        url: parking.uri,
        showLine: true,
        data: [],
        pointRadius: 1,
        pointStyle: 'line',
        borderColor: [
          randomColor({hue: hue}),
        ],
        borderWidth: 2
      });
    });
  }

  refreshObservables() {
    this.counters = [];
    this.disposable = [];
    for (let index = 0; index < this.observables.length; index++) {
      this.counters[index] = 0;
      this.disposable[index] = this.observables[index].subscribe(
        (meas) => {
          this.counters[index]++;
          if (this.counters[index] >= 15 ) {
            this.counters[index] = 0;
            const indexOfDataset = findIndex(this.chart.data.datasets, (o) => o.url === meas.parkingUrl);
            this.chart.data.datasets[indexOfDataset].data.splice(0, 0, {
              x: meas.timestamp * 1000,
              y: meas.value
            });
            this.chart.update();
          }
        }
      )
    }
  }

  ngOnDestroy() {
    this.disposable.forEach(element => {
      element.unsubscribe();
    });
  }
}

