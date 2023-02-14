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
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { productInterface } from '@app/models/products.interface';
import { ProductsService } from '@app/services/Products/products.service';
import {
  faBars,
  faHeart,
  faShoppingCart,
  faUser,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { userInterface } from '@models/users.interface';
import { UsersService } from '@service/Users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

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
  pedidos!: Array<productInterface>;
  user!: userInterface | undefined;
  userID!: string | null | undefined;
  products!: productInterface[];
  paragraphSpinner!: string;

  // !!! Sections !!!

  @ViewChild('order') order!: ElementRef;
  @ViewChild('userInfo') userInfo!: ElementRef;

  @ViewChild('header') header!: ElementRef;
  @ViewChild('home') home!: ElementRef;
  @ViewChild('about') about!: ElementRef;
  @ViewChild('iconsContainer') iconsContainer!: ElementRef;
  @ViewChild('productsSection') productsSection!: ElementRef;
  @ViewChild('review') review!: ElementRef;
  @ViewChild('contact') contact!: ElementRef;
  @ViewChild('footer') footer!: ElementRef;

  constructor(
    private readonly formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private usersService: UsersService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public productsServices: ProductsService
  ) {}

  @HostListener('window:scroll')
  scrolling(): void {
    if (window.scrollY > 300)
      this.renderer.addClass(this.header.nativeElement, 'active');
    else this.renderer.removeClass(this.header.nativeElement, 'active');
  }

  async ngOnInit() {
    this.paragraphSpinner = 'Cargando...';
    this.spinner
      .show()
      .then(() => {
        this.userID = localStorage.getItem('userID');
        if (this.userID)
          this.usersService.getUser(this.userID).subscribe(
            (res) => {
              this.user = res ? res : undefined;
              this.pedidos =
                this.user && this.user.pedido && this.user.pedido.length
                  ? this.user.pedido
                  : this.pedidos;
            },
            (err) => console.error(err),
            () => this.spinner.hide()
          );
        else {
          this.pedidos = JSON.parse(localStorage.getItem('pedido')!);
          this.spinner.hide();
        }
      })
      .finally(() =>
        setTimeout(() => {
          if (this.document.location.pathname !== '/') this.getOutSections();
          else this.closeSection();
        }, 0)
      );
  }

  closeSection() {
    this.renderer.removeClass(this.header.nativeElement, 'noneDisplay');
    this.renderer.removeClass(this.home.nativeElement, 'noneDisplay');
    this.renderer.removeClass(this.about.nativeElement, 'noneDisplay');
    this.renderer.removeClass(this.iconsContainer.nativeElement, 'noneDisplay');
    this.renderer.removeClass(
      this.productsSection.nativeElement,
      'noneDisplay'
    );
    this.renderer.removeClass(this.review.nativeElement, 'noneDisplay');
    this.renderer.removeClass(this.contact.nativeElement, 'noneDisplay');
    this.renderer.removeClass(this.footer.nativeElement, 'noneDisplay');

    this.router.navigate(['/']);
  }

  getOrder() {
    if (this.pedidos && this.pedidos.length)
      this.ngOnInit().then(() =>
        this.renderer.addClass(this.order.nativeElement, 'active')
      );
    else
      Swal.fire({
        icon: 'warning',
        html: '<span>No has agregado nada al carro de compras</span>',
      })
        .then(() => this.ngOnInit())
        .finally(() => this.spinner.hide());
  }

  getOutOrder() {
    this.renderer.removeClass(this.order.nativeElement, 'active');
    // this.closeSection();
  }

  getOutUser() {
    this.renderer.removeClass(this.userInfo.nativeElement, 'active');
    this.closeSection();
  }

  getOutSections() {
    this.renderer.addClass(this.header.nativeElement, 'noneDisplay');
    this.renderer.addClass(this.home.nativeElement, 'noneDisplay');
    this.renderer.addClass(this.about.nativeElement, 'noneDisplay');
    this.renderer.addClass(this.iconsContainer.nativeElement, 'noneDisplay');
    this.renderer.addClass(this.productsSection.nativeElement, 'noneDisplay');
    this.renderer.addClass(this.review.nativeElement, 'noneDisplay');
    this.renderer.addClass(this.contact.nativeElement, 'noneDisplay');
    this.renderer.addClass(this.footer.nativeElement, 'noneDisplay');
  }

  getUser() {
    if (localStorage.getItem('userID'))
      return this.renderer.addClass(this.userInfo.nativeElement, 'active');

    this.router.navigate(['login']).then(() => this.ngOnInit());
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
      .then(() => this.getOutUser())
      .then(() => this.router.navigate(['/login']))
      .then(() => (this.pedidos = []))
      .then(() => (this.user = undefined))
      .then(() => (this.userID = undefined))
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
          .updateUser(this.user._id!, this.user.favoritos, 'favoritos')
          .subscribe(
            (res) => this.ngOnInit(),
            (err) =>
              this.spinner.hide().then(() => {
                console.error(err);
                Swal.fire({
                  confirmButtonColor: '#000',
                  icon: 'error',
                  html: err.error.message,
                  scrollbarPadding: false,
                });
              }),
            () => this.spinner.hide()
          );
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

  existeComboPedido(_id: string): Boolean {
    if (this.pedidos && this.pedidos.length)
      return this.pedidos?.some((product) => product._id === _id)!;
    else if (this.user)
      return this.user.pedido?.some((product) => product._id === _id)!;

    return false;
  }

  async addToCar(product: productInterface, i?: number): Promise<void> {
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
              this.router.navigate(['/login', product._id]);
              return;
            }

            this.pedidos = [];
            this.pedidos.push(product);
            localStorage.setItem('pedido', JSON.stringify(this.pedidos));
          });
        });
      } else {
        this.pedidos.push(product);
        localStorage.setItem('pedido', JSON.stringify(this.pedidos));
        this.ngOnInit().then(() => setTimeout(() => this.spinner.hide(), 500));
      }
    } else {
      if (!this.pedidos) this.pedidos = [];

      this.pedidos.push(product);

      this.usersService
        .updateUser(this.userID!, this.pedidos, 'pedido')
        .subscribe(
          () => this.ngOnInit(),
          (err) => console.error(err),
          () => this.spinner.hide()
        );
    }
  }

  async restToCar(_id: string, i?: number) {
    this.spinner.show().then(() => {
      if (typeof i == 'number') {
        let list = this.document.querySelectorAll('.iconsList')[i];

        this.renderer.removeClass(list, 'active');
      }

      if (this.user) {
        this.pedidos = this.user.pedido?.filter(
          (product) => product._id !== _id
        )!;

        this.usersService
          .updateUser(this.userID!, this.pedidos, 'pedido')
          .subscribe(() => this.spinner.hide());
      } else {
        this.pedidos = this.pedidos.filter((product) => product._id !== _id);

        localStorage.setItem('pedido', JSON.stringify(this.pedidos));

        setTimeout(() => this.spinner.hide(), 500);
      }
    });
  }
}
