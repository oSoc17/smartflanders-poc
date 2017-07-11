import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ParkingDataService } from './../../services/parking-data.service';
import Parking from './../../models/parking'
import Chart from 'chart.js';
import { find } from 'lodash';

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.css']
})

export class DetailspageComponent implements OnInit {

  public data = {
    labels: [
      'Free spaces',
      'Total spaces'
    ],
    datasets: [{
      data: [],
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
  public donutChart;

  public ctx;
  private parkingDataService: ParkingDataService;
  private parking: Parking;

  constructor(
    private _parkingDataService: ParkingDataService,
    private route: ActivatedRoute,
    private router: Router){
    this.parkingDataService = _parkingDataService;
  }

  ngOnInit() {

    this.drawChart();
       let id = this.route.snapshot.paramMap.get('id');
        this.parkingDataService.getParkings().then(result => {
      this.parking = find(result, function (o) {
        return o.id == id
      });
    }).then(() => {
      this._parkingDataService.getNewestParkingData(this.parking.uri).then(result => {
        this.addData(this.donutChart, [parseInt(result.value), this.parking.totalSpaces - parseInt(result.value)]);
        this.donutChart.update();  
      })
    })
    console.log(this.data);
    

    
  }


  private drawChart(){
       this.ctx = document.getElementById('donut-chart');
        this.donutChart = new Chart(this.ctx, {
      type: 'doughnut',
      data: this.data,
      options: {
        label: ["Free Spaces", "Total spaces"],
        rotation: -1.25 * Math.PI,
        circumference: 1.5 * Math.PI,
        legend: {
          display: false
        },
        elements: {
          center: {
            text: this.parking.totalSpaces,
            color: '#FF6384', // Default is #000000
            fontStyle: 'Arial', // Default is Arial
            sidePadding: 20 // Defualt is 20 (as a percentage)
          }
        }
      },
      pieceLabel: {
        mode: 'label',
        fontSize: 14,
        fontStyle: 'bold',
        fontColor: '#000',
        fontFamily: '"Lucida Console", Monaco, monospace'
      }
    });
  }


  private addData(chart, data) {
    chart.data.datasets.forEach((dataset) => {
      dataset.data = data;
    });
    chart.update();
  }
}

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
      const centerY = (((chart.chartArea.top + chart.chartArea.bottom) * 1.1) / 2);
      ctx.font = fontSizeToUse + 'px ' + fontStyle;
      ctx.fillStyle = color;

      // Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});



