import {Component, Input, OnInit} from '@angular/core';

import Chart from 'chart.js';

@Component({
  selector: 'app-chart-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.css']
})
export class ScatterComponent implements OnInit {
  @Input() private data;
  private context;
  private parkingHistory;
  private config;
  private chart;

  constructor() { }

  ngOnInit() {

    this.context = document.getElementById('scatter-chart');
    this.parkingHistory = [];
    this.config = {
      type: 'scatter',
      data: {
        datasets: [{
          label: '',
          data: this.parkingHistory,
          pointRadius: 0,
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
              display: false
            }
          }]
        }
      }
    };
    this.chart = new Chart(this.context, this.config);
  }

}
