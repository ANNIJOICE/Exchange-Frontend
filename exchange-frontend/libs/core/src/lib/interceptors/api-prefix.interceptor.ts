import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  constructor(@Inject('BASE_API_URL') private baseUrl: string) {}

  intercept(
    request: HttpRequest<object>,
    next: HttpHandler
  ): Observable<HttpEvent<object>> {
    request = request.clone({
      url: this.baseUrl + '/api' + request.url
    });
    return next.handle(request);
  }
}
