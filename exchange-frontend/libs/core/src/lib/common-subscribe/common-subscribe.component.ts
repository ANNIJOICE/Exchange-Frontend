import { OnDestroy } from '@angular/core';
import { Observable, PartialObserver, Subject, Subscription } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  template: ''
})
// TODO: Add Angular decorator.
export abstract class CommonSubscribeComponent implements OnDestroy {
  // This is set to true if this.subscribe() has been called and it hasn't returned yet.
  public waiting = false;
  // used for clean the subscription when the component destroy
  protected destroyed$: Subject<boolean> = new Subject<boolean>();
  // when the component is destroyed.
  protected subscriptions: Subscription[] = [];

  constructor() {}

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    // Unsubscribe from all the subscriptions we know about for cleanup.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // This method can be used when you want to handle the subscription to the observable yourself but want to have

  protected subscribe<T>(
    observable: Observable<T>,
    observerOrNext?: PartialObserver<T> | ((value: T) => void),
    error?: (error: any) => void,
    complete?: () => void,
    ignoreWaiting: boolean = false
  ): Subscription | null {
    if (observable) {
      // Wrap the subscription, error, and complete callbacks to set this.waiting when the call returns.
      if (!ignoreWaiting) {
        const oldError: ((error: any) => void) | undefined = error;
        const oldObserver: PartialObserver<T> | ((value: T) => void) =
          observerOrNext ?? (() => console.log('No observer provided'));

        const oldComplete: () => void = complete ?? (() => {});

        this.waiting = true;

        if (oldObserver) {
          observerOrNext = (value: T) => {
            // wrap subscription callback
            this.waiting = false;
            (oldObserver as (value: T) => void)(value);
          };
        }

        if (oldError) {
          error = (e: any) => {
            // wrap error handler
            this.waiting = false;
            oldError(e);
          };
        }

        if (oldComplete) {
          complete = () => {
            // wrap complete handler
            this.waiting = false;
            oldComplete();
          };
        }
      }

      let subscription: Subscription;
      if (error) {
        subscription = observable.subscribe(
          observerOrNext as (value: T) => void,
          error,
          complete
        );
      } else {
        subscription = observable.subscribe(
          observerOrNext as PartialObserver<T>
        );
      }
      this.subscriptions.push(subscription);
      return subscription;
    }
    return null;
  }
}
