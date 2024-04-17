import { Component, OnInit } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { BasketService } from '../../../services/common/models/basket.service';
import { List_Basket_Item } from '../../../contracts/basket/list_basket_item';
import { Update_Basket_Item } from '../../../contracts/basket/update_basket_İtem';
import { OrderService } from '../../../services/common/models/order.service';
import { Create_Order } from '../../../contracts/order/create_order';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';
import { Router } from '@angular/router';
import { DialogOptions, DialogService } from '../../../services/common/dialog.service';
import { BasketItemDeleteState, BasketItemRemoveDialogComponent } from '../../../dialogs/basket/basket-item-remove-dialog/basket-item-remove-dialog.component';
import { ShoppingCompleteDialogComponent, ShoppingCompleteDialogState } from '../../../dialogs/shopping-complete-dialog/shopping-complete-dialog.component';

declare var $: any;
@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrl: './baskets.component.scss'
})
export class BasketsComponent extends BaseComponent implements OnInit {

  constructor(private dialogService: DialogService, spinner: NgxSpinnerService, private basketService: BasketService, private orderService: OrderService, private toastrService: CustomToastrService, private router: Router) {
    super(spinner);
  }
  basketItems: List_Basket_Item[];
  async ngOnInit(): Promise<void> {

    this.showSpinner(SpinnerType.BallNewtonCradle);
    this.basketItems = await this.basketService.get();
    this.hideSpinner(SpinnerType.BallNewtonCradle);
  }
  async changeQuantity(object: any) {
    this.showSpinner(SpinnerType.BallNewtonCradle);
    //id yi metotda ikinci parametre olarak alabilirdik. Aşağıdaki de olur.
    // jquery deki $.data("id") ye karşılık gelen angular kodu
    //input un id si nedir öğrenmek için bu şekilde yakalaya biliriz. data-deneme $.data("deneme")
    const basketItemId: string = object.target.attributes["id"].value;//id yi yakladık
    const quantity: number = object.target.value;//igili input un value sunu getirdi bize
    const basketItem: Update_Basket_Item = new Update_Basket_Item();
    basketItem.basketItemId = basketItemId;
    basketItem.quantity = quantity;
    await this.basketService.updateQuantity(basketItem);
    this.hideSpinner(SpinnerType.BallNewtonCradle);
  }

  removeBasketItem(basketItemId: string) {
    //$("#basketModal").modal("hide");
    this.dialogService.openDialog(
      {
        componentType: BasketItemRemoveDialogComponent,
        data: BasketItemDeleteState.Yes,
        afterClosed: async () => {
          this.showSpinner(SpinnerType.BallNewtonCradle);
          await this.basketService.remove(basketItemId);
          $("." + basketItemId).fadeOut(500, () => this.hideSpinner(SpinnerType.BallNewtonCradle));
          //$("#basketModal").modal("show");
        }
      });


  }

  shoppingComplete() {
    this.dialogService.openDialog({
      componentType: ShoppingCompleteDialogComponent,
      data: ShoppingCompleteDialogState.Yes,
      afterClosed: async () => {
        this.showSpinner(SpinnerType.BallNewtonCradle);
        const order: Create_Order = new Create_Order();
        order.address = "beylikdüzü";
        order.description = "dikkatli getirin";
        await this.orderService.create(order);
        this.hideSpinner(SpinnerType.BallNewtonCradle);
        $("#basketModal").modal("hide");
        this.router.navigate(["/"]);
        this.toastrService.message("Sipariş Alınmıştır!", "Sipariş Oluşturuldu",
          {
            messageType: ToastrMessageType.Info,
            position: ToastrPosition.TopRight
          });

      }
    });

  }
}
