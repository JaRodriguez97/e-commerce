import { Component, OnInit } from '@angular/core';
import {
  faHeart,
  faShare,
  faShoppingCart,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  faShoppingCart = faShoppingCart;
  faHeart = faHeart;
  faShare = faShare;
  faEye = faEye;

  
  constructor() {}

  ngOnInit(): void {}
}
