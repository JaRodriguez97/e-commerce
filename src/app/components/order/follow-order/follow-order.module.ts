import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FollowOrderRoutingModule } from './follow-order-routing.module';
import { FollowOrderComponent } from './follow-order.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [FollowOrderComponent],
  imports: [FontAwesomeModule, CommonModule, FollowOrderRoutingModule],
})
export class FollowOrderModule {}
