import {Component, OnInit, Input, ViewChild, OnDestroy, EventEmitter} from '@angular/core';
import Parking from './../../../models/parking';
import Chart from 'chart.js';
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
  public chart;
  private disposable = [];
  private counters: Array<number> = [];

  constructor() {}

  ngOnInit() {
    const context = this.scatter.nativeElement;
    const config = {
      animation: false,
      type: 'scatter',
      data: { datasets: this.datasets },
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
        legend: { display: true },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'hour',
              displayFormats: { hour: 'MMM D, HH:mm' },
              parse: (value) => moment(value).toISOString(),
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
          }],
        }
      }
    };
    this.chart = new Chart(context, config);
    this.refreshParkings();
    this.chart.update();
    this.refreshObservables();
    this.emitter.subscribe(e => {
      switch (e) {
        case 'clearGraph':
          this.clearGraph(); break;
        case 'parkingsChanged':
          this.refreshParkings(); break;
        case 'observablesChanged':
          this.refreshObservables(); break;
      }
    });
  }

  clearGraph() {
    this.disposable.forEach(element => {
      element.unsubscribe();
    });
    this.chart.data.datasets.forEach(ds => {
      ds.data.splice(0, ds.data.length);
    });
    this.chart.update();
  }

  refreshParkings() {
    this.datasets.splice(0, this.datasets.length);
    console.log('Refreshing parkings');
    const hues = ['red', 'orange', 'blue', 'purple'];
    // const pointStyles = ['cross', 'crossRot', 'rect',
    //                      'rectRounded', 'rectRot', 'star', 'triangle'];
    let iHue = 0;
    // let iStyle = 0;
    this.parkings.forEach(parking => {
      const hue = hues[iHue];
      // const style = pointStyles[iStyle];
      iHue = iHue === hues.length - 1 ? 0 : iHue + 1;
      // iStyle = iStyle === pointStyles.length - 1 ? 0 : iStyle + 1;
      this.datasets.push({
        fill: false,
        label: parking.name + ' (' + parking.datasetName + ')',
        url: parking.uri,
        showLine: true,
        data: [],
        pointRadius: 1,
        pointStyle: 'line',
        // pointStyle: style,
        borderColor: [
          randomColor({hue: hue}),
        ],
        borderWidth: 2
      });
    });
  }

  refreshObservables() {
    this.counters.splice(0, this.counters.length);
    this.disposable.splice(0, this.disposable.length);
    for (let index = 0; index < this.observables.length; index++) {
      this.counters[index] = 0;
      this.disposable[index] = this.observables[index].subscribe(
        (meas) => {
          this.counters[index]++;
          if (this.counters[index] >= 50) {
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

