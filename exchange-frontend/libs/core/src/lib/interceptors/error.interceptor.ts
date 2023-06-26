import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(@Inject('BASE_API_URL') private baseUrl: string) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // return next.handle(request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            // Unauthorised: redirect to login
            // document.location.href = this.baseUrl.authBase + 'login?redirect=' + this.baseUrl.systemBase + this.router.routerState.snapshot.url;
            break;
          case 403:
            // Forbidden: redirect to dashboard
            document.location.href = document.location.origin + '/';
            break;
        }
        return throwError(error);
      })
    );
  }
}
