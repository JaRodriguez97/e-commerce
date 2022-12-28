import { Component, OnInit } from '@angular/core';
import { faQuoteRight, faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  faQuoteRight = faQuoteRight;
  faStar = faStar;
  constructor() {}

  ngOnInit(): void {}
}
