import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { pedidoRealizadoInterface } from '@models/pedidoRealizado.interface';
import { UsersService } from '@service/Users/users.service';

@Component({
  selector: 'app-follow-order',
  templateUrl: './follow-order.component.html',
  styleUrls: ['./follow-order.component.css'],
})
export class FollowOrderComponent implements OnInit {
  faCircleCheck = faCircleCheck;
  faSpinner = faSpinner;
  pedidoEnSeguimiento!: pedidoRealizadoInterface;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let { id } = this.activatedRoute.snapshot.params;
    this.usersService.getSeguimientoPedido(id).subscribe((res) => {
      this.pedidoEnSeguimiento = res[0];
      if (
        this.pedidoEnSeguimiento.entregado &&
        this.pedidoEnSeguimiento.entregado.finalizado
      ) {
        Swal.fire({
          icon: 'success',
          title: 'tu pedido ha finalizado y ha sido entregado',
          html: '<h6>Si tienes algun inconveniente por favor, comuniate por nuestro PQRS de WhatsApp</h6>',
          confirmButtonText: 'Contactar por WhatsApp',
          confirmButtonColor: '#2AB53E',
          cancelButtonText: 'Pedido entregado satisfactoriamente',
          cancelButtonColor: '#000',
          showCancelButton: true,
        }).then((response) => {
          if (response.isConfirmed)
            window
              ? window.open('https://wa.me/573243973949', '_blank')
              : undefined;
        });
      }
    });
  }
}
