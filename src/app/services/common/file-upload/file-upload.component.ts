import { Component, Input } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadDialogComponent, FileUploadDialogState } from '../../../dialogs/file-upload-dialog/file-upload-dialog.component';
import { DialogService } from '../dialog.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../../base/base.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {

  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private customToastrService: CustomToastrService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService

  ) { }

  public files: NgxFileDropEntry[];

  @Input() options: Partial<FileUploadOptions>;

  public selectedFiles(files: NgxFileDropEntry[]) {

    this.files = files;
    const fileData: FormData = new FormData(); //bunun içine dosyayı atıyoruz
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {//dosyayı atabilmek için türünü değiştirdik
        fileData.append(_file.name, _file, file.relativePath);
      })
    }
    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: () => { //Eğer Cevap Evet SİL ise Bu işlemi yap...
        this.spinner.show(SpinnerType.BallNewtonCradle);
        this.httpClientService.post({

          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({ "responseType": "blob" })
        }, fileData).subscribe({

          next: (data) => {
            const message: string = "Dosyalar başarıyla yüklenmiştir"
            this.spinner.hide(SpinnerType.BallNewtonCradle);
            if (this.options.IsAdminPage) {
              this.alertifyService.message(message, {
                dismissOther: true,
                messageType: MessageType.Success,
                position: Position.TopRight
              })

            } else {
              this.customToastrService.message(message, "Başarılı", {
                messageType: ToastrMessageType.Success,
                position: ToastrPosition.TopRight
              })

            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            const message: string = "Dosyalar yüklenirken hata oluştu."
            this.spinner.hide(SpinnerType.BallNewtonCradle);
            if (this.options.IsAdminPage) {
              this.alertifyService.message(message, {
                dismissOther: true,
                messageType: MessageType.Error,
                position: Position.TopRight
              })
            } else {
              this.customToastrService.message(message, "Başarısız", {
                messageType: ToastrMessageType.Error,
                position: ToastrPosition.TopRight
              })

            }
          }
        })

      },
    }

    );



  }

  // openDialog(afterClosed: any): void {
  //   const dialogRef = this.dialog.open(FileUploadDialogComponent, {
  //     data: FileUploadDialogState.Yes
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result == FileUploadDialogState.Yes) {
  //       afterClosed();
  //     }
  //   });
  // }
}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  IsAdminPage?: boolean = false;
} 