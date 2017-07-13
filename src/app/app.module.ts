import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ParkingDataService} from './services/parking-data.service';
import { AppRoutingModule } from './app.routes';
import { HomepageComponent } from './home/homepage/homepage.component';
import { MdCardModule, MdButtonModule, MdToolbarModule, MdInputModule } from '@angular/material';
import { DetailspageComponent } from './details/detailspage/detailspage.component';
import { ParkingCardComponent } from './home/homepage/parking-card/parking-card.component';
import { NavbarComponent } from './shared/nav/navbar/navbar.component';
import { DoughnutComponent } from './shared/charts/doughnut/doughnut.component';
import { LineComponent } from './shared/charts/line/line.component';
import { ScatterComponent } from './shared/charts/scatter/scatter.component';
import { TimeFrameSelectComponent } from './details/time-frame-select/time-frame-select.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    DetailspageComponent,
    ParkingCardComponent,
    NavbarComponent,
    DoughnutComponent,
    LineComponent,
    ScatterComponent,
    TimeFrameSelectComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    MdCardModule,
    MdButtonModule,
    MdToolbarModule,
    MdInputModule,
    FormsModule,
    BrowserAnimationsModule,
    ],
  providers: [ParkingDataService],
  bootstrap: [AppComponent]
})

export class AppModule { }
