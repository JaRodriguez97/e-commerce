import { Component, OnInit } from '@angular/core';
import { faCircleCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-follow-order',
  templateUrl: './follow-order.component.html',
  styleUrls: ['./follow-order.component.css'],
})
export class FollowOrderComponent implements OnInit {
  faCircleCheck = faCircleCheck;
  faSpinner = faSpinner;

  constructor() {}

  ngOnInit(): void {}
}
