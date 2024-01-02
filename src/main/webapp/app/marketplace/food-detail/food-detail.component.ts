import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BLANK_IMAGE_URL } from 'app/app.constants';
import { IFood, IFoodVM } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';
import { MarketplaceService } from '../service/marketpalce.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Category } from 'app/entities/enumerations/category.model';
import { DEFAULT_SORT, ITEMS_PER_PAGE, START_PAGE } from 'app/config/pagination.constants';

@Component({
  selector: 'jhi-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.scss']
})
export class FoodDetailComponent implements OnInit{
  foodVM: IFoodVM | null = null;
  BLANK_IMAGE_URL = BLANK_IMAGE_URL;
  account: Account | null = null;
  Category = Category;
  itemsPerPage = ITEMS_PER_PAGE;
  defaultSort = DEFAULT_SORT;
  startPage = START_PAGE;

  constructor(protected activatedRoute: ActivatedRoute, protected foodService: FoodService, protected marketplaceService: MarketplaceService, private accountService: AccountService, public router: Router) {}
  
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foodVM }) => {
      this.foodVM = foodVM;
    });
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  navigateToHome(): void {
    this.router.navigate(['']);
  }

}
