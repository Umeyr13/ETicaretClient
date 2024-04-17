import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from '../../../contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { list_product } from '../../../contracts/list_product';
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs';
import { List_Product_Image } from '../../../contracts/list_product_image';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClientService: HttpClientService) { }

  create(product: Create_Product, successCallBack?: any, errorCallBack?: (errorMessage: string) => void) {
    this.httpClientService.post({
      controller: "products"
    },
      product)
      .subscribe({
        next: successCallBack,
        error: (errorResponse: HttpErrorResponse) => {
          const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
          let message = "";
          _error.forEach((v, index) => {
            v.value.forEach((_v, index) => {
              message += `${_v}<br>`;
            });
          });
          errorCallBack(message);
        }
      });



    // .subscribe(result => {
    //   successCallBack();// eğer işlem başarıyılsa bu foksiyonu işleme alır. mükemmel. #1
    // }, (errorResponse: HttpErrorResponse) => {//hata varsa buradayız..
    //   const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
    //   let message = "";
    //   _error.forEach((v, index) => {
    //     v.value.forEach((_v, index) => {
    //       message += `${_v}<br>`;
    //     });
    //   });
    //   errorCallBack(message);
    // });

  }

  async read(pagenumber: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalProductCount: number, products: list_product[] }> {
    const promiseData: Promise<{ totalProductCount: number, products: list_product[] }> =
      firstValueFrom(this.httpClientService.get<{ totalProductCount: number, products: list_product[] }>({
        controller: "products",
        queryString: `page=${pagenumber}&size=${size}`
      }));
    promiseData.then(d => successCallBack())
      .catch(err => errorCallBack(err));
    // .catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));

    return await promiseData;
  }

  async delete(id: string) {
    const deleteObservable = this.httpClientService.delete({
      controller: "products"
    }, id);

    await firstValueFrom(deleteObservable);

  }

  async readImages(id: string, successCallBack?: () => void): Promise<List_Product_Image[]> {
    const getObservable: Observable<List_Product_Image[]> = this.httpClientService.get<List_Product_Image[]>({
      action: "getproductimages",
      controller: "products"
    }, id);
    const images: List_Product_Image[] = await firstValueFrom(getObservable);
    successCallBack();
    return images;

  }

  async deleteImage(Id: string, imageId: string, successCallBack?: () => void) {
    const deleteObservable = this.httpClientService.delete({
      action: "deleteproductimage",
      controller: "products",
      queryString: `imageId=${imageId}`
    }, Id);
    await firstValueFrom(deleteObservable);
    successCallBack();
  }

  async changeShowcaseImage(imageId: string, productId: string, successCallBack?: () => void): Promise<void> {
    const changeShowcaseImageObservable = this.httpClientService.get({
      controller: "products",
      action: "changeshowcaseimage",
      queryString: `ImageId=${imageId}&productId=${productId}`
    });

    await firstValueFrom(changeShowcaseImageObservable);
    successCallBack();
  }
}
