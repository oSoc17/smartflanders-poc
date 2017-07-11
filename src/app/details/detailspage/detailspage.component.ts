import { Component, OnInit } from '@angular/core';

import Chart from 'chart.js';

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.css']
})
export class DetailspageComponent implements OnInit {

  private data = {
    labels: [
      'Red',
      'Blue'
    ],
    datasets: [{
      // Filled spaces, Total paces
      data: [300, 100],
      backgroundColor: [
        '#FF6384',
        '#36A2EB'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB'
      ]
    }]
  };
  private donutChart;
  private ctx;


  constructor() { }

  ngOnInit() {

    this.ctx = document.getElementById('donut-chart');

    this.data = {
      labels: [
        'Red',
        'Blue'
      ],
      datasets: [{
        // Filled spaces, Total paces
        data: [300, 100],
        backgroundColor: [
          '#FF6384',
          '#36A2EB'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB'
        ]
      }]
    };

    this.donutChart = new Chart(this.ctx, {
      type: 'doughnut',
      data: this.data,
      options: {
        rotation: -1.25 * Math.PI,
        circumference: 1.5 * Math.PI
      }
    });
  }
}
