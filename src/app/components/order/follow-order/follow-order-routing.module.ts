import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FollowOrderComponent } from './follow-order.component';

const routes: Routes = [{ path: '', component: FollowOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowOrderRoutingModule { }
