import { Component, OnInit, ViewChild } from '@angular/core';
import { Create_Product } from '../../../contracts/create_product';
import { ListComponent } from './list/list.component';


@Component({
  selector: 'app-admin-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {

  @ViewChild(ListComponent) listComponents: ListComponent

  createdProduct(createdProduct: Create_Product) {

    this.listComponents.getProducts();

  }




}


