import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faBars,
  faHeart,
  faShoppingCart,
  faUser,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { pedidoInterface } from '@models/pedido.interface';
import { userInterface } from '@models/users.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { Database } from 'src/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'eCommerce';
  navbar!: Element;
  faHeart: IconDefinition = faHeart;
  faShoppingCart: IconDefinition = faShoppingCart;
  faUser: IconDefinition = faUser;
  faBars: IconDefinition = faBars;
  pedidos!: pedidoInterface[];
  user!: userInterface | undefined;
  userID!: String | null | undefined;

  @ViewChild('order') order!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private database: Database
  ) {}

  @HostListener('window:scroll')
  scrolling(): void {
    this.navbar.classList.remove('active');

    if (window.scrollY > 500)
      this.document.querySelector('header')!.classList.add('active');
    else this.document.querySelector('header')!.classList.remove('active');
  }

  async ngOnInit() {
    this.navbar = this.document.querySelector('.navbar')!;
    console.log({ localStorage });
  }

  getOrder() {
    this.renderer.addClass(this.order.nativeElement, 'active');
  }

  getOutOrder() {
    this.renderer.removeClass(this.order.nativeElement, 'active');
  }

  getUser() {
    if (localStorage.getItem('userID')) {
    } else this.router.navigate(['login']);
  }

  async reloadTo(uri: String) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
}
