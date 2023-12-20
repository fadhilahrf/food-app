import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { IFood, IFoodVM } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';
import { MarketplaceService } from 'app/marketplace/service/marketpalce.service';
import { tap } from 'rxjs';

@Component({
  selector: 'food-recommendation',
  templateUrl: './food-recommendation.component.html',
  styleUrls: ['./food-recommendation.component.scss']
})
export class FoodRecommendationComponent implements OnInit {
  @Input() account?: Account | null;
  foodVMs?: IFoodVM[];
  isLoading = false;

  constructor(protected foodService: FoodService, protected marketplaceService: MarketplaceService, public router: Router){}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    const queryObject: any = {
      page: 0,
      size: 10,
      sort: ['id','asc'],
    };
    this.foodService.findAllForMarketplace(queryObject).subscribe(res=>{
      if(res.body){
        this.foodVMs = res.body;
      }
      this.isLoading = false;
    })
  }

  goToFoodDetail(id: string): void {
    this.router.navigate([`/foods/${id}/detail`]);
  }

  navigateToHome(): void {
    this.router.navigate(['']);
  }
}
