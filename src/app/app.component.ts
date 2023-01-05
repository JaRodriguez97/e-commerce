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
  @ViewChild('user') userInfo!: ElementRef;

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
    if (window.scrollY > 300) {
      if (!this.products && window.scrollY > 1000)
        this.spinner.show().then(() =>
          this.disenosServices
            .getDisenos()
            .then((disenosPromise) => (this.products = disenosPromise))
            .catch((err) => console.error(err))
            .finally(() => this.spinner.hide())
        );

      this.document.querySelector('header')!.classList.add('active');
    } else this.document.querySelector('header')!.classList.remove('active');
  }

  async ngOnInit() {
    this.pedidos =
      this.user && this.user.pedido
        ? this.user.pedido
        : JSON.parse(localStorage.getItem('pedido')!);
  }

  getOrder() {
    this.renderer.addClass(this.order.nativeElement, 'active');
  }

  getOutOrder() {
    this.renderer.removeClass(this.order.nativeElement, 'active');
  }

  getOutUser() {
    this.renderer.removeClass(this.userInfo.nativeElement, 'active');
  }

  getUser() {
    if (localStorage.getItem('userID'))
      this.renderer.addClass(this.userInfo.nativeElement, 'active');
    else this.router.navigate(['login']);
  }

  async reloadTo(uri: String) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  existeComboPedido = (_id: String): Boolean => {
    return this.user && this.user.pedido && this.user.pedido.length
      ? this.user.pedido.some((pedido) => pedido._id === _id)
      : false;
  };

  async addToCar(_id: String, i?: number, realoadTo?: String): Promise<void> {
    this.spinner.show().then(() => {
      if (typeof i == 'number') {
        let list = this.document.querySelectorAll('.iconsList')[i];

        this.renderer.addClass(list, 'active');
      }

      if (!this.user) {
        if (!this.pedidos) {
          this.spinner.hide().then(() => {
            Swal.fire({
              icon: 'question',
              title: 'NO ESTÁ REGISTRADO',
              html: `<h4>Desea ingresar antes de hacer su pedido?</h4>
        <h6 style="font-size:10px">Si marca NO podrá hacer su pedido sin
        ningún problema, pero de manera anónima.</h6>`,
              showCancelButton: true,
              cancelButtonText: 'Quiero hacer mi pedido ya',
              confirmButtonText: 'Deseo ingresar a mi cuenta',
              scrollbarPadding: false,
            }).then((response) => {
              if (response.isConfirmed) this.router.navigate(['/login', _id]);
              else {
                this.pedidos = [];
                this.pedidos.push({ _id, cantidad: 1 });
                localStorage.setItem('pedido', JSON.stringify(this.pedidos));
                this.ngOnInit();
              }
            });
          });
        } else {
          this.pedidos.push({ _id, cantidad: 1 });
          localStorage.setItem('pedido', JSON.stringify(this.pedidos));
          this.ngOnInit();
        }
      } else {
        this.pedidos.push({ _id, cantidad: 1 });

        // this.usersService
        //   .updateUser(this.userID, this.pedidos, 'pedido')
        //   .subscribe(
        //     (res) => {
        //       console.log(
        //         '🚀 ~ file: app.component.ts:430 ~ this.usersService.updateUser ~ res',
        //         res
        //       );
        //     },
        //     (err) =>
        //       this.spinner.hide().then(() => {
        //         console.error(err);
        //         Swal.fire({
        //           confirmButtonColor: '#000',
        //           icon: 'error',
        //           html: err.error.message,
        //           scrollbarPadding: false,
        //         });
        //       }),
        //     () => this.ngOnInit()
        //   );
      }
    });
  }
}
