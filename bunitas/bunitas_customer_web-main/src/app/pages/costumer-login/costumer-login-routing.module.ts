import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CostumerLoginComponent } from './costumer-login.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: CostumerLoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CostumerLoginRoutingModule {}
