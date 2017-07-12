import { Component, OnInit, Input } from '@angular/core';
import Parking from './../../../models/parking'
import Chart from 'chart.js';
import $ from 'jquery';
import Measurement from './../../../models/measurement';

@Component({
  selector: 'app-chart-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent implements OnInit {

  @Input() private parking: Parking;
  @Input() private measurement: Measurement;
  private vacantSpaces: string;
  private context;
  private data;
  private config;
  private chart;

  constructor() { }

  ngOnInit() {
    
    const number = this.measurement.value;
    // Replace number with amount of vacant spaces left
    this.vacantSpaces = number.toString();

   
    this.data = {
      labels: [
        'Filled',
        'Vacant'
      ],
      datasets: [{
        // Filled spots, vacant spots
        data: [this.measurement.value , this.parking.totalSpaces],
        backgroundColor: [
          '#C7C7C7',
          '#4fc3f7'
        ],
        hoverBackgroundColor: [
          '#9d9d9d',
          '#0aa2e7'
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
            color: '#4fc3f7', // Default is #000000
            fontStyle: 'Roboto', // Default is Arial
            sidePadding: 20 // Defualt is 20 (as a percentage)
          }
        }
      }
    };
       setTimeout( () => {
          this.context = document.getElementById(this.parking.id);
          this.chart = new Chart(this.context, this.config);
    }, 1);


  }


    public addData( data) {
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data = data;
    });
    this.chart.update();
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

