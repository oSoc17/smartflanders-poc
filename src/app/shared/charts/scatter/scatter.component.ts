import { Component, OnInit, Input } from '@angular/core';
import Parking from './../../../models/parking'
import Chart from 'chart.js';
import Measurement from './../../../models/measurement';
import ParkingHistory from './../../../models/parking-history'

@Component({
  selector: 'app-chart-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.css']
})
export class ScatterComponent implements OnInit {
  @Input() private data;
  @Input() private parking: Parking;
  private context;
  private parkingHistory: ParkingHistory;
  private chartData = [];
  private config;
  private chart;

  constructor() { }

  ngOnInit() {
    this.context = document.getElementById('scatter-chart');
    this.parkingHistory = new ParkingHistory(this.parking, []);
    this.config = {
      type: 'scatter',
      data: {
        datasets: [{
          label: '',
          data: this.chartData,
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

    this.data.subscribe(d => {
      this.chartData.push({x: d.timestamp, y: parseInt(d.value, 10)});
      this.chart.update();
    });
  }

}
