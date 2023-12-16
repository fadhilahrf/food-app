import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BLANK_IMAGE_URL } from 'app/app.constants';
import { IFood, IFoodVM } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';
import { MarketplaceService } from '../service/marketpalce.service';

@Component({
  selector: 'jhi-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.scss']
})
export class FoodDetailComponent implements OnInit{
  foodVM: IFoodVM | null = null;
  BLANK_IMAGE_URL = BLANK_IMAGE_URL;

  constructor(protected activatedRoute: ActivatedRoute, protected foodService: FoodService, protected marketplaceService: MarketplaceService) {}
  
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foodVM }) => {
      this.foodVM = foodVM;
      if (foodVM) {
        this.foodVM = foodVM;
      }
    });
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
}
