import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { ASC, DEFAULT_SORT_DATA, DESC, SORT } from 'app/config/navigation.constants';
import { ITEMS_PER_PAGE, PAGE_HEADER, START_PAGE, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { IFoodVM } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';
import { DataService } from 'app/shared/service/data.service';
import { Observable, combineLatest, switchMap, tap } from 'rxjs';
import { MarketplaceService } from '../service/marketpalce.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Category } from 'app/entities/enumerations/category.model';
import { FormBuilder } from '@angular/forms';

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

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = START_PAGE;

  SORT_OPTION = [
    { value: 'name', text: 'name' },
    { value: 'price', text: 'price' },
    { value: 'category', text: 'category' },
  ];

  selectedSortOption = 'name';

  account: Account | null = null;

  Category = Category;

  categoryOptions = Object.keys(Category);

  category = null;

  searchForm = this.formBuilder.group({
    search: [null]
  });

  constructor(
    protected foodService: FoodService,
    protected dataService: DataService,
    protected marketplaceService: MarketplaceService,
    protected activatedRoute: ActivatedRoute,
    protected formBuilder: FormBuilder,
    protected accountService: AccountService,
    protected router: Router,
    ){}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
    this.activatedRoute.queryParams.subscribe(params=>{
      if(params['category']){
        this.category = params['category'];
      }
    })
    this.categoryOptions.push('ALL')
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

  categoryOptionChange(value: any): void {
    this.category = value;
    this.navigateToWithComponentValues();
  }

  goToFoodDetail(id: string): void {
    this.router.navigate([`/foods/${id}/detail`]);
  }

  protected searchFood(){
    const search = this.searchForm.get(['search'])!.value;
    console.log(search)
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
    if (this.category && this.category != 'ALL') {
      queryObject.category = this.category;
    }

    const search = this.searchForm.get(['search'])!.value;

    if(search){
      queryObject.search = search;
    }

    return this.foodService.findAllForMarketplace(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj: any = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    if (this.category && this.category != 'ALL') {
      queryParamsObj.category = this.category;
    }

    const search = this.searchForm.get(['search'])!.value;

    if(search){
      queryParamsObj.search = search;
    }

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
