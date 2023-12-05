import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IFood } from 'app/entities/food/food.model';

@Component({
  selector: 'jhi-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.scss']
})
export class FoodDetailComponent implements OnInit{
  food: IFood | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ food }) => {
      this.food = food;
      if (food) {
        this.food = food;
      }
    });
  }
}
