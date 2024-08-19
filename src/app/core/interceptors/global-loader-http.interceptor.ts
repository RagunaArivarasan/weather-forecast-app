import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { GlobalLoaderService } from '../services/global-loader.service';

@Injectable()
export class GlobalLoaderHttpInterceptor implements HttpInterceptor {
  private currentActiveRequests = 0;

  constructor(private loader: GlobalLoaderService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.currentActiveRequests++;
    this.loader.setIsLoading(true);
    return next.handle(request).pipe(
      finalize(() => {
        this.currentActiveRequests--;
        if (this.currentActiveRequests === 0) {
          this.loader.setIsLoading(false);
        }
      })
    );
  }
}