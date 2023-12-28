import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { IOrder } from '../order.model';
import { OrderService } from '../service/order.service';

export const orderResolve = (route: ActivatedRouteSnapshot): Observable<null | IOrder> => {
  const id = route.params['id'];
  const router = inject(Router);
  if (id) {
    return inject(OrderService)
      .find(id)
      .pipe(
        mergeMap((order: HttpResponse<IOrder>) => {
          if (order.body) {
            return of(order.body);
          } else {
            router.navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export const orderWithAuthorizedUserResolve = (route: ActivatedRouteSnapshot): Observable<null | IOrder> => {
  const id = route.params['id'];
  const router = inject(Router);
  if (id) {
    return inject(OrderService)
      .findWithAuthorizedUser(id)
      .pipe(
        mergeMap((order: HttpResponse<IOrder>) => {
          if (order.body) {
            return of(order.body);
          } else {
            router.navigate(['404']);
            return EMPTY;
          }
        }),
        catchError((error) => {
          router.navigate(['404']);
          return of(null);
        })
      );
  }
  return of(null);
};

export const orderCartResolve = (route: ActivatedRouteSnapshot): Observable<null | IOrder> => {
  const id = route.params['id'];
  const router = inject(Router);
  return inject(OrderService)
      .findByCurrentUserAndStatusIsActive()
      .pipe(
        mergeMap((order: HttpResponse<IOrder>) => {
          if (order.body) {
            return of(order.body);
          } else {
            router.navigate(['404']);
            return EMPTY;
          }
        }),
        catchError((error) => {
          router.navigate(['404']);
          return of(null);
        })
      );
};