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
    this.ngOnInit().then(() =>
      this.renderer.addClass(this.order.nativeElement, 'active')
    );
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

  validateFavorite(_id: String): Boolean {
    if (this.user && this.user.favoritos && this.user.favoritos.length)
      return this.user.favoritos.some((favorito) => favorito === _id);

    return false;
  }

  addFavorite(_id: string) {
    this.spinner.show().then(() => {
      if (this.user) {
        if (this.user.favoritos) {
          if (this.user.favoritos.length) {
            let index = this.user.favoritos.indexOf(_id);

            if (index == -1) this.user.favoritos.push(_id);
            else this.user.favoritos!.splice(index, 1);
          } else this.user.favoritos.push(_id);
        } else {
          this.user.favoritos = [];
          this.user.favoritos.push(_id);
        }

        this.usersService
          .updateUser(
            this.user._id!,
            { favoritos: this.user.favoritos },
            'usuarios'
          )
          .then((res) => this.ngOnInit())
          .catch((err) =>
            this.spinner.hide().then(() => {
              console.error(err);
              Swal.fire({
                confirmButtonColor: '#000',
                icon: 'error',
                html: err.error.message,
                scrollbarPadding: false,
              });
            })
          )
          .finally(() => this.spinner.hide());
      } else {
        this.spinner.hide();
        Swal.fire({
          icon: 'warning',
          title: 'NO HAS INICIADO SESIÓN',
          text: 'Registrate antes para poder marcar como favorito',
          showCancelButton: true,
          scrollbarPadding: false,
        }).then((response) => {
          if (response.value) this.router.navigate(['/login']);
        });
      }
    });
  }

  existeComboPedido = (_id: string): Boolean => {
    if (this.pedidos && this.pedidos.length)
      return this.pedidos.some((pedido) => pedido._id === _id);
    else if (this.user)
      return this.user.pedido!.some((pedido) => pedido._id === _id);

    return false;
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
          this.ngOnInit().then(() =>
            setTimeout(() => this.spinner.hide(), 500)
          );
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
      } else {
        this.pedidos = this.pedidos.filter((pedido) => pedido._id !== _id);

        localStorage.setItem('pedido', JSON.stringify(this.pedidos));

        setTimeout(() => this.spinner.hide(), 500);
      }
    });
  }
}
