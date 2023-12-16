package com.application.foodapp.domain;

import static com.application.foodapp.domain.FoodTestSamples.*;
import static com.application.foodapp.domain.OrderItemTestSamples.*;
import static com.application.foodapp.domain.OrderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.application.foodapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderItem.class);
        OrderItem orderItem1 = getOrderItemSample1();
        OrderItem orderItem2 = new OrderItem();
        assertThat(orderItem1).isNotEqualTo(orderItem2);

        orderItem2.setId(orderItem1.getId());
        assertThat(orderItem1).isEqualTo(orderItem2);

        orderItem2 = getOrderItemSample2();
        assertThat(orderItem1).isNotEqualTo(orderItem2);
    }

    @Test
    void foodTest() throws Exception {
        OrderItem orderItem = getOrderItemRandomSampleGenerator();
        Food foodBack = getFoodRandomSampleGenerator();

        orderItem.setFood(foodBack);
        assertThat(orderItem.getFood()).isEqualTo(foodBack);

        orderItem.food(null);
        assertThat(orderItem.getFood()).isNull();
    }

    @Test
    void orderTest() throws Exception {
        OrderItem orderItem = getOrderItemRandomSampleGenerator();
        Order orderBack = getOrderRandomSampleGenerator();

        orderItem.setOrder(orderBack);
        assertThat(orderItem.getOrder()).isEqualTo(orderBack);

        orderItem.order(null);
        assertThat(orderItem.getOrder()).isNull();
    }
}
