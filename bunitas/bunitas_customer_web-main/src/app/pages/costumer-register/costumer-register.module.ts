import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostumerRegisterRoutingModule } from './costumer-register-routing.module';
import { CostumerRegisterComponent } from './costumer-register.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CostumerRegisterComponent],
  imports: [CommonModule, CostumerRegisterRoutingModule, FormsModule],
})
export class CostumerRegisterModule {}
