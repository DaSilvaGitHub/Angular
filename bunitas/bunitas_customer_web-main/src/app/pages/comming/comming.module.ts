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

import { CommingRoutingModule } from './comming-routing.module';
import { CommingComponent } from './comming.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    CommingComponent
  ],
  imports: [
    CommonModule,
    CommingRoutingModule,
    FormsModule,
    NgxSkeletonLoaderModule
  ]
})
export class CommingModule { }
