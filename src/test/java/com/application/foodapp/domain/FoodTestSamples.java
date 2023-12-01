package com.application.foodapp.domain;

import java.util.UUID;

public class FoodTestSamples {

    public static Food getFoodSample1() {
        return new Food().id("id1").name("name1").imgUrl("imgUrl1");
    }

    public static Food getFoodSample2() {
        return new Food().id("id2").name("name2").imgUrl("imgUrl2");
    }

    public static Food getFoodRandomSampleGenerator() {
        return new Food().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString()).imgUrl(UUID.randomUUID().toString());
    }
}
