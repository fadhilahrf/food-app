import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';

import ConfigurationComponent from './configuration.component';
import { configurationRoute } from './configuration.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([configurationRoute])],
  declarations: [ConfigurationComponent],
})
export class ConfigurationModule {}
