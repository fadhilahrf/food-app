import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';


import { IFood } from '../food.model';
import { FoodService } from '../service/food.service';
import { FoodFormService, FoodFormGroup } from './food-form.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CropImageModalComponent } from '../crop-image-modal/crop-image-modal.component';
import { ImageCroppedEvent, base64ToFile  } from 'ngx-image-cropper';
import { BLANK_IMAGE_URL } from 'app/app.constants';
import { Category } from 'app/entities/enumerations/category.model';

@Component({
  selector: 'jhi-food-update',
  templateUrl: './food-update.component.html'
})
export class FoodUpdateComponent implements OnInit {
  @ViewChild('foodImg') foodImg: any;
  isSaving = false;
  food: IFood | null = null;

  editForm: FoodFormGroup = this.foodFormService.createFoodFormGroup();
  selectedFile?: File | null;

  BLANK_IMAGE_URL = BLANK_IMAGE_URL;

  Category = Category;

  constructor(
    protected foodService: FoodService,
    protected foodFormService: FoodFormService,
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ food }) => {
      this.food = food;
      if (food) {
        this.updateForm(food);
      }
    });
  }

  onFileChanged(event: any): void {
    this.selectedFile = event.target.files[0];
   
    if (this.selectedFile) {
      const modalRef = this.modalService.open(CropImageModalComponent, { size: 'lg', windowClass: 'model-xl', centered: true });
      modalRef.componentInstance.imgChangeEvt = event;
      modalRef.componentInstance.croppedImg.subscribe((cropEvent: ImageCroppedEvent)=>{
        if(cropEvent){
          this.editForm.get('imgUrl')!.setValue(cropEvent.objectUrl);
          console.log(cropEvent.base64)
          this.editForm.get('imgFile')!.setValue(cropEvent.blob as File);
        }
      });
    }
  }

  clearImage(): void {
    this.selectedFile = null;
    this.editForm.get('imgFile')!.setValue(null);
    this.editForm.get('imgUrl')!.setValue(null);
    if (this.foodImg) {
      this.foodImg.nativeElement.value = '';
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const food = this.foodFormService.getFood(this.editForm);
    if (food.id !== null) {
      this.subscribeToSaveResponse(this.foodService.update(food));
    } else {
      this.subscribeToSaveResponse(this.foodService.create(food));
    }
  }

  urltoFile(imgPath: string, filename: string): File {
    return new File([imgPath], filename);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFood>>): void {
    result.pipe(switchMap((res: HttpResponse<IFood>)=>{
      if(this.editForm.get('imgFile')!.value){
        return this.foodService.uploadImage(res.body?.id!, this.editForm.get('imgFile')!.value!);
      }
      return of(res);
    })).pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: (res) => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(food: IFood): void {
    this.food = food;
    this.foodFormService.resetForm(this.editForm, food);
  }
}
