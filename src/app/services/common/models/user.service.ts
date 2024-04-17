import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from '../../../Entities/user';
import { CreateUser } from '../../../contracts/users/create_user';
import { Observable, firstValueFrom } from 'rxjs';
import { Token } from '../../../contracts/Token/Token';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { MessageType } from '../../admin/alertify.service';
import { TokenResponse } from '../../../contracts/Token/TokenResponse';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService,
    private toastrService: CustomToastrService
  ) { }

  async create(user: User): Promise<CreateUser> {
    const observable: Observable<CreateUser | User> = this.httpClientService.post<CreateUser | User>({
      controller: "users"
    }, user);

    return await firstValueFrom(observable) as CreateUser;
  }
  async updatePassword(userId: string, resetToken: string, password: string, passwordConfirm: string, succsesCallBack?: () => void, errorCallback?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      action: "update-password",
      controller: "users"
    },
      {
        userId: userId,
        resetToken: resetToken,
        password: password,
        passwordConfirm: passwordConfirm
      }
    );
    const promiseData: Promise<any> = firstValueFrom(observable);
    promiseData.then(value => succsesCallBack())
      .catch(error => errorCallback(error));
    await promiseData;
  }

}
