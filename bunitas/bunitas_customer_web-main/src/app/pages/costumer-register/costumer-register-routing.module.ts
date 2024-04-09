import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostumerRegisterComponent } from './costumer-register.component';

const routes: Routes = [
  {
    path: '',
    component: CostumerRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CostumerRegisterRoutingModule {}
