import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from '../../../Entities/user';
import { UserService } from '../../../services/common/models/user.service';
import { CreateUser } from '../../../contracts/users/create_user';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';
import { BaseComponent } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends BaseComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toasterService: CustomToastrService, spinner: NgxSpinnerService) {
    super(spinner)
  }

  frm: FormGroup
  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      nameSurname: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)]],
      username: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)]],
      email: ["", [
        Validators.required,
        Validators.maxLength(250),
        Validators.email]],
      password: ["", [
        Validators.required]],
      passwordConfirm: ["", [
        Validators.required]]
    },
      {
        validators: (group: AbstractControl): ValidationErrors | null => {
          let sifre = group.get("password").value;
          let sifre2 = group.get("passwordConfirm").value;
          return sifre === sifre2 ? null : { passwordMismatch: true }
        }
      }
    )
  }
  submitted: boolean = false;
  //bu get de dolayı proporty oldu. "()" ile kullanmaya gerek yok
  get component() {
    return this.frm.controls;
  }

  async OnSubmit(_user: User) {
    this.submitted = true;

    if (this.frm.invalid)
      return;

    const result: CreateUser = await this.userService.create(_user);
    if (result.succeeded)
      this.toasterService.message(result.message, "Kullanıcı Kaydı Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      })
    else
      this.toasterService.message(result.message, "Hata Oluştu", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      })
  }




}
