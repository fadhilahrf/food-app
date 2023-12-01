import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'jhi-crop-image-modal',
  templateUrl: './crop-image-modal.component.html',
  styleUrls: ['./crop-image-modal.component.scss']
})
export class CropImageModalComponent {
  imgChangeEvt: any = null;
  cropImgPreview: any = null;
  cropEvent: any = null;
  @Output() croppedImg: EventEmitter<any> = new EventEmitter();

  constructor(protected activeModal: NgbActiveModal, protected sanitizer: DomSanitizer) {}

  cropImg(e: ImageCroppedEvent): void {
    this.cropEvent = e;
    console.log(e)
    this.cropImgPreview = this.sanitizer.bypassSecurityTrustUrl(e.objectUrl!);
  }

  saveCroppedImg(): void {
    this.croppedImg.emit(this.cropEvent);
    this.activeModal.close();
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  initiateCrop(): void {
    this.imgChangeEvt = { file: this.imgChangeEvt.file, base64: '' };
  }
}
