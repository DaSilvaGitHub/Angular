/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalonsRoutingModule } from './salons-routing.module';
import { SalonsComponent } from './salons.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from "ngx-spinner";
import { IvyCarouselModule } from 'angular-responsive-carousel';
@NgModule({
  declarations: [
    SalonsComponent
  ],
  imports: [
    CommonModule,
    SalonsRoutingModule,
    CarouselModule,
    MDBBootstrapModule.forRoot(),
    NgxPaginationModule,
    NgxSkeletonLoaderModule,
    NgxSpinnerModule,
    IvyCarouselModule
  ]
})
export class SalonsModule { }
