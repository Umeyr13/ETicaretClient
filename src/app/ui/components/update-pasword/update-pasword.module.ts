import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdatePaswordComponent } from './update-pasword.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    UpdatePaswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: UpdatePaswordComponent }
    ])

  ]
})
export class UpdatePaswordModule { }
