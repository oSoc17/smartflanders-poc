import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { AppComponent } from './app.component';
import { ParkingDataService} from './services/parking-data.service';
import { AppRoutingModule } from './app.routes';
import { HomepageComponent } from './home/homepage/homepage.component';
import { MdCardModule, MdButtonModule } from '@angular/material';
import { DetailspageComponent } from './details/detailspage/detailspage.component';
import { ParkingCardComponent } from './home/homepage/parking-card/parking-card.component';
import { NavbarComponent } from './shared/nav/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    DetailspageComponent,
    ParkingCardComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    MdCardModule,
    MdButtonModule
  ],
  providers: [ParkingDataService],
  bootstrap: [AppComponent]
})

export class AppModule { }
