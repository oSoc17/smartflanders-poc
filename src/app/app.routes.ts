import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './home/homepage/homepage.component';
import { ComparepageComponent } from './compare/comparepage/comparepage.component';
import { DetailspageComponent } from './details/detailspage/detailspage.component';

const routes: Routes = [
  { path: '', redirectTo: '/parkings', pathMatch: 'full' },
  { path: 'parkings', component: HomepageComponent },
  { path: 'compare', component: ComparepageComponent },
  { path: 'detail', component: DetailspageComponent },
  { path: 'parkings/:id', component: DetailspageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
