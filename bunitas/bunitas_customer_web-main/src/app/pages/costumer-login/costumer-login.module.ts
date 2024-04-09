import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CostumerLoginComponent } from './costumer-login.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CostumerLoginRoutingModule } from './costumer-login-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CostumerLoginComponent],
  imports: [
    CommonModule,
    MDBBootstrapModule.forRoot(),
    CostumerLoginRoutingModule,
    FormsModule,
  ],
})
export class CostumerLoginModule {}
