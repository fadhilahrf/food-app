import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { IOrderItem } from '../order-item.model';
import { OrderItemService } from '../service/order-item.service';

export const orderItemResolve = (route: ActivatedRouteSnapshot): Observable<null | IOrderItem> => {
  const id = route.params['id'];
  const router = inject(Router);
  if (id) {
    return inject(OrderItemService)
      .find(id)
      .pipe(
        mergeMap((orderItem: HttpResponse<IOrderItem>) => {
          if (orderItem.body) {
            return of(orderItem.body);
          } else {
            inject(Router).navigate(['404']);
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

export default orderItemResolve;
