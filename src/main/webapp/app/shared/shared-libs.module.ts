import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { TranslationModule } from "./language/translation.module";
import { TranslateModule } from "@ngx-translate/core";
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
    exports: [
      FormsModule,
      CommonModule,
      NgbModule,
      InfiniteScrollModule,
      FontAwesomeModule,
      ReactiveFormsModule,
      TranslationModule,
      TranslateModule,
      ImageCropperModule
    ],
  })
export class SharedLibsModule {}