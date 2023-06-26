import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import {
  Observable,
  Subject,
  catchError,
  finalize,
  map,
  of,
  switchMap,
  tap,
  throwError
} from 'rxjs';
import { clearLocalStorage } from '@exchange/util';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  public headers: HttpHeaders = new HttpHeaders();
  refreshTokenInProgress: boolean = false;
  tokenRefreshedSource = new Subject();
  tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.headers.set('Content-Type', 'application/json');
    this.headers.set('Access-Control-Allow-Origin', '*');
    this.headers.set(
      'Access-Control-Allow-Headers',
      'Origin, Authorization, Content-Type, Accept'
    );

    request = request.clone({
      headers: this.headers
    });

    const userToken: string = localStorage.getItem('accessToken') as string;

    if (userToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${userToken}`
        }
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (userToken) {
          return this.handleResponseError(error, request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  /**
   * @description Function to handle error response.
   * If thrown error is 401, refreshes the access token.
   * If thrown error is 422, logs out the user.
   * If any other error is thrown, returns it to the subscribed function.
   */
  handleResponseError(
    error: HttpErrorResponse,
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Invalid token error
    if (error.status === 401) {
      return this.getAccessToken().pipe(
        switchMap(() => {
          request = this.addTokenHeader(request);
          return next.handle(request);
        }),
        catchError((e: any) => {
          if (e.status !== 401) {
            return this.handleResponseError(
              e,
              {} as HttpRequest<any>,
              {} as HttpHandler
            );
          }
          return throwError(() => e);
        })
      );
    }

    // Blocked user Error
    // else if (error.status === 451){
    //   this.logout(true)
    // }

    // Access denied error
    // else if (error.status === 422) {
    //   this.logout();
    // }

    return throwError(() => error);
  }

  /**
   * @description Function to generate access token from refresh token
   * If refreshing access token is in progress, hold other requests else proceed.
   */
  getAccessToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      // if accesstoken generation is in progress, waiting for it to complete
      return new Observable((observer) => {
        this.tokenRefreshed$.subscribe(() => {
          observer.next();
          observer.complete();
        });
      });
    } else {
      // Generate access token
      this.refreshTokenInProgress = true;
      const refreshToken: string | null = localStorage.getItem('refreshToken');
      // future: need to get access token through api
      return of(1);
    }
  }

  /**
   * @description Function to add authorsation headers after refreshing access token
   */
  addTokenHeader(request: HttpRequest<unknown>): HttpRequest<any> {
    const token = localStorage.getItem('accessToken');
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * @description Function to log out an user. Navigates to login screen
   */
  logout(isBlocked?: boolean): void {
    clearLocalStorage();
    // this.notificationService.showError(
    //   isBlocked ? ERROR_MESSAGES.BLOCKED_ADMIN : ERROR_MESSAGES.SESSION_EXPIRED
    // );
    // this.router.navigate([FrontEndRoutes.login]);
  }
}
