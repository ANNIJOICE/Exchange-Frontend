import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiPrefixInterceptor } from './interceptors/api-prefix.interceptor';
import { environment } from '@exchange/api';

@NgModule({
  imports: [CommonModule]
})
@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true
    },
    {
      provide: 'BASE_API_URL',
      useValue: environment.apiBase
    }
  ]
})
export class CoreModule {}
