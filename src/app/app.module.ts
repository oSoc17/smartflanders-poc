import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { AppComponent } from './app.component';
import { ParkingDataService} from './services/parking-data.service';
import { AppRoutingModule } from './app.routes';
import { HomepageComponent } from './home/homepage/homepage.component';
import { MdCardModule, MdButtonModule, MdToolbarModule } from '@angular/material';
import { DetailspageComponent } from './details/detailspage/detailspage.component';
import { ParkingCardComponent } from './home/homepage/parking-card/parking-card.component';
import { NavbarComponent } from './shared/nav/navbar/navbar.component';
import { DoughnutComponent } from './shared/charts/doughnut/doughnut.component';
import { LineComponent } from './shared/charts/line/line.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    DetailspageComponent,
    ParkingCardComponent,
    NavbarComponent,
    DoughnutComponent,
    LineComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    MdCardModule,
    MdButtonModule,
    MdToolbarModule
  ],
  providers: [ParkingDataService],
  bootstrap: [AppComponent]
})

export class AppModule { }
