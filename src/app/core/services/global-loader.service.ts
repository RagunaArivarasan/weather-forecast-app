import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, share } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalLoaderService {
  private _isLoading$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  public setIsLoading(isLoading: boolean) {
    this._isLoading$.next(isLoading);
  }

  public isLoading$(): Observable<boolean> {
    return this._isLoading$.asObservable().pipe(share());
  }
}
