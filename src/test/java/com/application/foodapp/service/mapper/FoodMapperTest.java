package com.application.foodapp.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class FoodMapperTest {

    private FoodMapper foodMapper;

    @BeforeEach
    public void setUp() {
        foodMapper = new FoodMapperImpl();
    }
}
