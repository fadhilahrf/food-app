package com.application.foodapp.web.rest.vm;

import com.application.foodapp.service.dto.FoodDTO;

public class FoodVM {
    private FoodDTO food;

    private Long orderedQuantity;

    public FoodDTO getFood() {
        return food;
    }
    public void setFood(FoodDTO food) {
        this.food = food;
    }

    public Long getOrderedQuantity() {
        return orderedQuantity;
    }
    public void setOrderedQuantity(Long orderedQuantity) {
        this.orderedQuantity = orderedQuantity;
    }
}
