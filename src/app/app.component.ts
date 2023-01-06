import { UsersService } from '@service/Users/users.service';
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
  userID!: string | null | undefined;
  products!: disenoInterface[] | DocumentData[];
  paragraphSpinner!: string;

  @ViewChild('order') order!: ElementRef;
  @ViewChild('userInfo') userInfo!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    public router: Router,
    public spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private database: Database,
    public disenosServices: DisenosService
  ) {}

  @HostListener('window:scroll')
  scrolling(): void {
    if (window.scrollY > 300) {
      if (!this.products && window.scrollY > 1000) {
        this.paragraphSpinner = 'buscando diseños...';

        this.spinner.show().then(() =>
          this.disenosServices
            .getDisenos()
            .then((disenosPromise) => (this.products = disenosPromise))
            .catch((err) => console.error(err))
            .finally(() => this.spinner.hide())
        );
      }

      this.document.querySelector('header')!.classList.add('active');
    } else this.document.querySelector('header')!.classList.remove('active');
  }

  async ngOnInit() {
    this.userID = localStorage.getItem('userID');

    if (this.userID) {
      this.usersService.getUser(this.userID).then((res) => {
        this.user = res ? res : undefined;
        this.pedidos = this.user!.pedido!;
      });
    } else this.pedidos = JSON.parse(localStorage.getItem('pedido')!);

    this.paragraphSpinner = 'Cargando...';
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

  logOut() {
    Swal.fire({
      icon: 'success',
      imageWidth: 100,
      confirmButtonColor: '#000',
      confirmButtonAriaLabel: '',
      html: '<b>Sesión Cerrada Exitosamente</b>',
      scrollbarPadding: false,
    })
      .then(() => this.ngOnInit())
      .then(() => this.reloadTo('login'))
      .then(() => (this.pedidos = []))
      .then(() => (this.user = undefined))
      .then(() => localStorage.clear());
  }

  async reloadTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  existeComboPedido = (_id: string): Boolean => {
    return this.user && this.user.pedido && this.user.pedido.length
      ? this.user.pedido.some((pedido) => pedido._id === _id)
      : false;
  };

  async addToCar(_id: string, i?: number): Promise<void> {
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
              if (response.isConfirmed) {
                this.router.navigate(['/login', _id]);
                return;
              }

              this.pedidos = [];
              this.pedidos.push({ _id, cantidad: 1 });
              localStorage.setItem('pedido', JSON.stringify(this.pedidos));
              this.ngOnInit().then(() => this.spinner.hide());
            });
          });
        } else {
          this.pedidos.push({ _id, cantidad: 1 });
          localStorage.setItem('pedido', JSON.stringify(this.pedidos));
          this.ngOnInit().then(() => this.spinner.hide());
        }
      } else {
        if (!this.pedidos) this.pedidos = [];

        this.pedidos.push({ _id, cantidad: 1 });

        this.usersService
          .updateUser(this.userID!, { pedido: this.pedidos }, 'usuarios')
          .then(() => this.ngOnInit())
          .then(() => this.spinner.hide());
      }
    });
  }

  async restToCar(_id: string, i?: number) {
    this.spinner.show().then(() => {
      if (typeof i == 'number') {
        let list = this.document.querySelectorAll('.iconsList')[i];

        this.renderer.removeClass(list, 'active');
      }

      if (this.user) {
        this.pedidos = this.user.pedido?.filter(
          (pedido) => pedido._id !== _id
        )!;

        this.usersService
          .updateUser(this.userID!, { pedido: this.pedidos }, 'usuarios')
          .then(() => this.spinner.hide());
      } else console.log(this.pedidos);
    });
  }
}
