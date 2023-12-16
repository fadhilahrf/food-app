package com.application.foodapp.domain;

import java.util.UUID;

public class OrderItemTestSamples {

    public static OrderItem getOrderItemSample1() {
        return new OrderItem().id("id1");
    }

    public static OrderItem getOrderItemSample2() {
        return new OrderItem().id("id2");
    }

    public static OrderItem getOrderItemRandomSampleGenerator() {
        return new OrderItem().id(UUID.randomUUID().toString());
    }
}
