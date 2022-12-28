import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faUser,
  faHeart,
  faShoppingCart,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'eCommerce';
  navbar!: Element;
  faHeart = faHeart;
  faShoppingCart = faShoppingCart;
  faUser = faUser;
  faBars = faBars;
  
  constructor(
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    // public localStorageService: LocalStorageService,
    // private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @HostListener('window:scroll')
  scrolling(): void {
    this.navbar.classList.remove('active');

    if (window.scrollY > 500)
      this.document.querySelector('header')!.classList.add('active');
    else this.document.querySelector('header')!.classList.remove('active');
  }

  ngOnInit() {
    this.navbar = this.document.querySelector('.navbar')!;
    console.log(
      '🚀 ~ file: app.component.ts:29 ~ AppComponent ~ this.navbar',
      this.navbar
    );

    // this.renderer.listen()

    // this.document.querySelector('#menu-bar')!.click = () => {
    //   this.navbar.classList.toggle('active');
    // };
    // this.document.querySelector('#close')!.onclick = () => {
    //   this.navbar.classList.remove('active');
    // };
  }
}
