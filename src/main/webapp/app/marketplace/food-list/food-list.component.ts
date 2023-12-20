import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { ASC, DEFAULT_SORT_DATA, DESC, SORT } from 'app/config/navigation.constants';
import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { IFood, IFoodVM } from 'app/entities/food/food.model';
import { EntityArrayResponseType, FoodService } from 'app/entities/food/service/food.service';
import { DataService } from 'app/shared/service/data.service';
import { Observable, combineLatest, switchMap, tap } from 'rxjs';
import { MarketplaceService } from '../service/marketpalce.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent implements OnInit {
  foodVMs?: IFoodVM[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = 5;
  totalItems = 0;
  page = 1;

  SORT_OPTION = [
    { value: 'name', text: 'name' },
    { value: 'price', text: 'price' },
  ];

  selectedSortOption = 'name';

  account: Account | null = null;

  constructor(
    protected foodService: FoodService,
    protected dataService: DataService,
    protected marketplaceService: MarketplaceService,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    public router: Router,
    ){}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
    this.load();
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: HttpResponse<IFoodVM[]>) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToHome(): void {
    this.router.navigate(['']);
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  sortOptionChange($event: any): void {
    this.selectedSortOption = $event.value;
  }

  goToFoodDetail(id: string): void {
    this.router.navigate([`/foods/${id}/detail`]);
  }

  protected loadFromBackendWithRouteInformations(): Observable<HttpResponse<IFoodVM[]>> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending)),
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: HttpResponse<IFoodVM[]>): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.foodVMs = dataFromBody;
    // this.foodVMs = dataFromBody.map(foodVM=>{
    //   foodVM.orderedQuantity = 0;
    //   return foodVM;
    // });
    // for(let i=0;i<2;i++){
    //   this.foods.push(...this.foods);
    // }
  }

  protected fillComponentAttributesFromResponseBody(data: IFoodVM[] | null): IFoodVM[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<HttpResponse<IFoodVM[]>> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.foodService.findAllForMarketplace(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

}
