import { DisenosService } from './../../services/Disenos/disenos.service';
import { disenoInterface } from './../../models/diseno.interface';
import { AppComponent } from './../../app.component';
import { Component, Input, OnInit } from '@angular/core';
import { userInterface } from '@app/models/users.interface';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  @Input('user') user: userInterface | undefined;
  pedidos!: disenoInterface[];

  constructor(
    public appComponent: AppComponent,
    private disenosService: DisenosService
  ) {}

  ngOnInit(): void {
    if (this.user) {
      if (this.user.pedido && this.user.pedido) {
        // this.pedidos = this.user.pedido.map((pedido) =>
        //   this.disenosService.getDiseno(pedido._id)
        // );
      }
    }
  }
}
