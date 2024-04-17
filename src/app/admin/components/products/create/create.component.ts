import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Create_Product } from '../../../../contracts/create_product';
import { ProductService } from '../../../../services/common/models/product.service';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { FileUploadOptions } from '../../../../services/common/file-upload/file-upload.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent extends BaseComponent implements OnInit {
  constructor(spinner: NgxSpinnerService, private productService: ProductService, private alertify: AlertifyService) {
    super(spinner)
  }
  ngOnInit(): void {

  }

  @Output() createdProduct: EventEmitter<Create_Product> = new EventEmitter();
  // @Output() fileUploadOptions: Partial<FileUploadOptions> = {
  //   action: "Upload",
  //   controller: "products",
  //   explanation: "Resimleri seçin...",
  //   IsAdminPage: true,
  //   accept: ".png, .jpg, .jpeg"
  // };

  create(Name: HTMLInputElement, Stock: HTMLInputElement, Price: HTMLInputElement) {
    this.showSpinner(SpinnerType.BallNewtonCradle);
    const create_product: Create_Product = new Create_Product();
    create_product.name = Name.value;
    create_product.stock = parseInt(Stock.value);
    create_product.price = parseFloat(Price.value);

    this.productService.create(create_product, () => {
      //Burası SuccessCallBack Fonksiyonu, eğer işlem başarılı olursa bu fonksiyon subscribe tarafindan işleme alınır. #1
      this.hideSpinner(SpinnerType.BallNewtonCradle);
      this.alertify.message("Ürün başarıyla eklenmiştir.", {
        dismissOther: true,
        messageType: MessageType.Success,
        position: Position.TopRight
      });
      this.createdProduct.emit(create_product);//selecter üzerinden bizi referans alan componente fırlattık.. işlem başarılı olursa #2

    }, errorMessage => {
      this.alertify.message(errorMessage, {
        messageType: MessageType.Error,
        position: Position.TopRight
      });
    });


  }

}
