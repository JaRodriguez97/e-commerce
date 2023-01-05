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
import { DisenosService } from '@service/Disenos/disenos.service';
import { DocumentData } from 'firebase/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { Database } from 'src/database';
import Swal from 'sweetalert2';
import { disenoInterface } from './models/diseno.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'eCommerce';
  faHeart: IconDefinition = faHeart;
  faShoppingCart: IconDefinition = faShoppingCart;
  faUser: IconDefinition = faUser;
  faBars: IconDefinition = faBars;
  pedidos!: pedidoInterface[];
  user!: userInterface | undefined;
  userID!: String | null | undefined;
  products!: disenoInterface[] | DocumentData[];

  @ViewChild('order') order!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private database: Database,
    public disenosServices: DisenosService
  ) {}

  @HostListener('window:scroll')
  scrolling(): void {
    if (window.scrollY > 50) {
      if (!this.products) {
        this.spinner.show();
        this.disenosServices
          .getDisenos()
          .then((disenosPromise) => (this.products = disenosPromise))
          .catch((err) => {})
          .finally(() => this.spinner.hide());
      }
      this.document.querySelector('header')!.classList.add('active');
    } else this.document.querySelector('header')!.classList.remove('active');
  }

  async ngOnInit() {}

  getOrder() {
    this.renderer.addClass(this.order.nativeElement, 'active');
  }

  getOutOrder() {
    this.renderer.removeClass(this.order.nativeElement, 'active');
  }

  getUser() {
    if (localStorage.getItem('userID')) {
      Swal.fire({
        title: 'ya te encuentras loguead@',
      });
    } else this.router.navigate(['login']);
  }

  async reloadTo(uri: String) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
}
