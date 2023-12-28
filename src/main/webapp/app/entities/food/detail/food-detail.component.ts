import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { IFood } from '../food.model';
import { BLANK_IMAGE_URL } from 'app/app.constants';

@Component({
  selector: 'jhi-food-detail',
  templateUrl: './food-detail.component.html',
})
export class FoodDetailComponent implements OnInit {
  @Input() food: IFood | null = null;

  BLANK_IMAGE_URL = BLANK_IMAGE_URL;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ food }) => {
      this.food = food;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
