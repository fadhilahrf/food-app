package com.application.foodapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A OrderItem.
 */
@Document(collection = "order_item")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OrderItem extends AbstractAuditingEntity<String> {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @DecimalMin(value = "0")
    @Field("price")
    private Double price;

    @DBRef
    @Field("food")
    @JsonIgnoreProperties(value = { "orderItems" }, allowSetters = true)
    private Food food;

    @DBRef
    @Field("order")
    @JsonIgnoreProperties(value = { "user", "orderItems" }, allowSetters = true)
    private Order order;

    @DecimalMin(value = "0")
    @Field("quantity")
    private Long quantity;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public OrderItem id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Double getPrice() {
        return this.price;
    }

    public OrderItem price(Double price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Food getFood() {
        return this.food;
    }

    public void setFood(Food food) {
        this.food = food;
    }

    public OrderItem food(Food food) {
        this.setFood(food);
        return this;
    }

    public Order getOrder() {
        return this.order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public OrderItem order(Order order) {
        this.setOrder(order);
        return this;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrderItem)) {
            return false;
        }
        return getId() != null && getId().equals(((OrderItem) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrderItem{" +
            "id=" + getId() +
            ", price=" + getPrice() +
            "}";
    }
}
