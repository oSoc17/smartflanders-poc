import { Component, OnInit } from '@angular/core';

import Chart from 'chart.js';
import $ from 'jquery';

@Component({
  selector: 'app-chart-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent implements OnInit {

  private vacantSpaces: string;
  private context;
  private data;
  private config;
  private chart;

  constructor() { }

  ngOnInit() {
    const number = 256;
    // Replace number with amount of vacant spaces left
    this.vacantSpaces = number.toString();
    this.context = document.getElementById('doughnut-chart');
    this.data = {
      labels: [
        'Filled',
        'Vacant'
      ],
      datasets: [{
        // Filled spots, vacant spots
        data: [1500, 100],
        backgroundColor: [
          '#4fc3f7',
          '#C7C7C7'
        ],
        hoverBackgroundColor: [
          '#0aa2e7',
          '#9d9d9d'
        ]
      }]
    };
    this.config = {
      type: 'doughnut',
      data: this.data,
      options: {
        // rotation: -1.25 * Math.PI,
        // circumference: 1.5 * Math.PI,
        legend: {
          display: false
        },
        elements: {
          center: {
            text: this.vacantSpaces,
            color: '#C7C7C7', // Default is #000000
            fontStyle: 'Roboto', // Default is Arial
            sidePadding: 20 // Defualt is 20 (as a percentage)
          }
        }
      }
    };
    this.chart = new Chart(this.context, this.config);
  }
}

// Chartjs plugin to center a string inside the doughnut
Chart.pluginService.register({
  beforeDraw: function (chart) {
    if (chart.config.options.elements.center) {
      // Get ctx from string
      const ctx = chart.chart.ctx;

      // Get options from the center object in options
      const centerConfig = chart.config.options.elements.center;
      const fontStyle = centerConfig.fontStyle || 'Arial';
      const txt = centerConfig.text;
      const color = centerConfig.color || '#000';
      const sidePadding = centerConfig.sidePadding || 20;
      const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
      // Start with a base font of 30px
      ctx.font = '30px ' + fontStyle;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(30 * widthRatio);
      const elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      const fontSizeToUse = Math.min(newFontSize, elementHeight);

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      const centerY = (((chart.chartArea.top + chart.chartArea.bottom) /* * 1.1 */) / 2); // Multiply with 1.1 when using incomplete donut
      ctx.font = fontSizeToUse + 'px ' + fontStyle;
      ctx.fillStyle = color;

      // Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});

