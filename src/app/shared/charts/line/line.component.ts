import { Component, OnInit } from '@angular/core';

import Chart from 'chart.js';

@Component({
  selector: 'app-chart-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit {

  private context;
  private parkingHistory;
  private config;
  private chart;

  constructor() { }

  ngOnInit() {

    this.context = document.getElementById('line-chart');
    this.parkingHistory = [];
    this.config = {
      type: 'line',
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
