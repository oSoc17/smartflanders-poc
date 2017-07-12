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
  @Input() private measurement: Measurement;
  private context;
  private parkingHistory: Array<ParkingHistory> = [];
  private config;
  private chart;

  constructor() { }

  ngOnInit() {
    this.data.subscribe(d => {
      console.log(d);
    });


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
