import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { UserAuthService } from './models/user-auth.service';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private toastrService: CustomToastrService, private userAuthService: UserAuthService, private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(catchError(error => {
      switch (error.status) {
        case HttpStatusCode.Unauthorized:

          //eğer buraya düşerse demek ki token ın süresi dolmuş, al sen bu refresh token ile bir kere daha istek göndermeyi dene sana api belki yeni token verir .ddd
          this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken"), (state) => {
            if (!state) {
              const url = this.router.url;
              if (url == "/products") {
                debugger;
                this.toastrService.message("Sepete ürün eklemek için oturum açmanız gerekiyor", "Oturum Açınız", { messageType: ToastrMessageType.Info, position: ToastrPosition.TopRight });
              } else
                this.toastrService.message("Bu işlemi yapmaya yetkiniz bulunmamaktadır!", "Yetkisiz İşlem", { messageType: ToastrMessageType.Warning, position: ToastrPosition.TopRight });

            }
          })
            .then(data => {
              //catchError dan dolayı foksiyonu async e çeviremedik ondan doalyı "then" kullandık..
            });
          break;
        case HttpStatusCode.InternalServerError:
          this.toastrService.message("Sunucuya erişilemiyor!", "Sunucu Hatası", { messageType: ToastrMessageType.Warning, position: ToastrPosition.TopRight });
          break;
        case HttpStatusCode.BadRequest:
          this.toastrService.message("Geçersiz istek yapıldı!", "Geçersiz İstek", { messageType: ToastrMessageType.Warning, position: ToastrPosition.TopRight });
          break;
        case HttpStatusCode.NotFound:
          this.toastrService.message("Sayfa bulunamadı!", "Sayfa Bulunamadı", { messageType: ToastrMessageType.Warning, position: ToastrPosition.TopRight });
          break;
        default:
          this.toastrService.message("Genel bir hata oluştu", "Bilinmeyen Hata", { messageType: ToastrMessageType.Warning, position: ToastrPosition.TopRight });
          break;
      }
      return of(error);
    }));
  }
}
