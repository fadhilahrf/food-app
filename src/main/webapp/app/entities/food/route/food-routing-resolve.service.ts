import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { IFood, IFoodVM } from '../food.model';
import { FoodService } from '../service/food.service';
export const foodResolve = (route: ActivatedRouteSnapshot): Observable<null | IFood> => {
  const id = route.params['id'];
  const router = inject(Router);
  if (id) {
    return inject(FoodService)
      .find(id)
      .pipe(
        mergeMap((food: HttpResponse<IFood>) => {
          if (food.body) {
            return of(food.body);
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

export const foodVMResolve = (route: ActivatedRouteSnapshot): Observable<null | IFoodVM> => {
  const id = route.params['id'];
  const router = inject(Router);
  if (id) {
    return inject(FoodService)
      .findOneForMarketplace(id)
      .pipe(
        mergeMap((foodVM: HttpResponse<IFoodVM>) => {
          if (foodVM.body) {
            return of(foodVM.body);
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
}
