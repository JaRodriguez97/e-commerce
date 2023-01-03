import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { pedidoInterface } from '@models/pedido.interface';
import { UsersService } from '@service/Users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('formBx') formBx!: ElementRef;
  @ViewChild('body') body!: ElementRef;
  telefono!: Number;
  contrasena!: String;
  repiteContrasena!: String;
  nombres!: String;
  apellidos!: String;
  email!: String;
  idCombo!: String;
  pedidos!: pedidoInterface[];

  constructor(
    private appComponent: AppComponent,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    // appComponent.ngOnInit().then(() => {});
  }

  ngOnInit(): void {
    this.spinner
      .show()
      .then(() => {
        if (localStorage.getItem('userID')) this.router.navigate(['/']);
        
        this.pedidos = localStorage.getItem('pedido')
          ? JSON.parse(localStorage.getItem('pedido')!)
          : [];
      })
      .catch((err) => console.error(err))
      .finally(() => this.spinner.hide());
  }

  signInBtn() {
    this.renderer.removeClass(this.formBx.nativeElement, 'active');
    this.renderer.removeClass(this.body.nativeElement, 'active');
  }

  signUpBtn() {
    this.renderer.addClass(this.formBx.nativeElement, 'active');
    this.renderer.addClass(this.body.nativeElement, 'active');
  }

  checkLogin() {
    this.spinner
      .show()
      .then(() => {
        if (!this.telefono) throw new Error('Diligenciar campo telefono');
        else if (!this.contrasena)
          throw new Error('Diligenciar campo contraseña');

        let form = {
          numeroTelefono: this.telefono,
          contraseña: this.contrasena,
        };

        this.usersService
          .getLogin(form)
          .then((res) => {
            let { id } = this.activatedRoute?.snapshot?.params || undefined;

            this.appComponent.user = res;

            if (id && res.pedido && !res.pedido.length && !this.pedidos.length)
              /*
              Si el usuario no tiene un pedido en el localStorage ni en la base
              de datos, creará el pedido a la base de datos.
            */
              this.usersService
                .updateUser(
                  res._id!,
                  { pedido: [{ _id: id, cantidad: 1 }] },
                  'pedido'
                )
                .then((res) =>
                  console.log('🚀 ~ line:98 ~ LoginComponent ~ User', res)
                );
            else if (
              !id &&
              (!res.pedido || !res.pedido.length) &&
              this.pedidos &&
              this.pedidos.length
            )
              /*
              Si el usuario tiene un pedido en el localStorage pero no en la
              base de datos, editará el pedido en la base de datos. 
            */
              this.usersService
                .updateUser(res._id!, this.pedidos, 'pedido')
                .then((res) =>
                  console.log('🚀 ~ line:101 ~ LoginComponent ~ User', res)
                );

            localStorage.removeItem('pedido');
          })
          .catch((err) =>
            this.spinner.hide().then(() => {
              console.error({ err });
              Swal.fire({
                confirmButtonColor: '#000',
                icon: 'error',
                html: err.error?.message ?? err.message ?? err,
              });
            })
          )
          .finally(() => {
            this.router
              .navigate(['/'])
              .then(() =>
                localStorage.setItem('userID', this.appComponent.user?._id!)
              )
              .then(() => this.spinner.hide());
          });
      })
      .catch((err) =>
        this.spinner.hide().then(() => {
          console.error(err);
          Swal.fire({
            confirmButtonColor: '#000',
            icon: 'error',
            html: err,
          });
        })
      );
  }

  checkSignUp() {
    this.spinner
      .show()
      .then(() => {
        if (!this.telefono) throw new Error('Diligenciar campo telefono');
        else if (!this.contrasena)
          throw new Error('Diligenciar campo contraseña');
        else if (!this.repiteContrasena)
          throw new Error('Diligenciar nuevamente la contraseña');
        else if (this.repiteContrasena !== this.contrasena)
          throw new Error('Las contraseñas no coinciden');

        let form = {
          numeroTelefono: this.telefono,
          contraseña: this.contrasena,
          nombres: this.nombres || '',
          apellidos: this.apellidos || '',
          email: this.email || '',
        };

        this.usersService
          .getSignUp(form)
          .then((res) =>
            this.spinner.hide().then(() =>
              Swal.fire({
                icon: 'success',
                imageWidth: 100,
                confirmButtonColor: '#000',
                html: `<b>Te damos la bienvenida ${
                  res!.nombres || res!.numeroTelefono
                }</b>`,
              }).then(() =>
                this.spinner
                  .show()
                  .then(() => this.appComponent.reloadTo('login'))
                  .then(() => setTimeout(() => this.spinner.hide(), 500))
              )
            )
          )
          .then(() => this.spinner.hide())
          .catch((err) =>
            this.spinner.hide().then(() => {
              console.error({ err });
              Swal.fire({
                confirmButtonColor: '#000',
                icon: 'error',
                html: err.error?.message ?? err.message ?? err,
              });
            })
          )
          .then(() => this.spinner.hide());
      })
      .catch((err) =>
        this.spinner.hide().then(() => {
          console.error({ err });
          Swal.fire({
            confirmButtonColor: '#000',
            icon: 'error',
            html: err.error?.message ?? err.message ?? err,
          });
        })
      );
  }
}
