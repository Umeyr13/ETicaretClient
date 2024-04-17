import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CustomerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: CustomerComponent },//rota belirledik... Burada path i "bilmemne" şeklinde  bırakabilirdik zaten tek bir tane component var bu modüle. Bu modüle gelen ona gider

    ])
  ]
})
export class CustomerModule { }
