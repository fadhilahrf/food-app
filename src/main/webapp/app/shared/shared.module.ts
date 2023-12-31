import { NgModule } from '@angular/core';

import FindLanguageFromKeyPipe from './language/find-language-from-key.pipe';
import TranslateDirective from './language/translate.directive';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { SortByDirective, SortDirective } from './sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from './date';
import { ItemCountComponent } from './pagination';
import { SharedLibsModule } from './shared-libs.module';
import HasAnyAuthorityDirective from './auth/has-any-authority.directive';
import { FilterComponent } from './filter';
import ActiveMenuDirective from 'app/layouts/navbar/active-menu.directive';


/**
 * Application wide Module
 */
@NgModule({
  imports: [SharedLibsModule],
  declarations: [
    AlertComponent,
    AlertErrorComponent,
    ActiveMenuDirective,
    HasAnyAuthorityDirective,
    FilterComponent,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    FindLanguageFromKeyPipe, 
    TranslateDirective
  ],
  exports: [
    SharedLibsModule,
    AlertComponent,
    AlertErrorComponent,
    ActiveMenuDirective,
    HasAnyAuthorityDirective,
    FilterComponent,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    FindLanguageFromKeyPipe, 
    TranslateDirective
  ],
})
export default class SharedModule {}
