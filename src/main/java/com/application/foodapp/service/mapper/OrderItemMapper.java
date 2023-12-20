package com.application.foodapp.service.mapper;

import com.application.foodapp.domain.Food;
import com.application.foodapp.domain.Order;
import com.application.foodapp.domain.OrderItem;
import com.application.foodapp.service.dto.FoodDTO;
import com.application.foodapp.service.dto.OrderDTO;
import com.application.foodapp.service.dto.OrderItemDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link OrderItem} and its DTO {@link OrderItemDTO}.
 */
@Mapper(componentModel = "spring")
public interface OrderItemMapper extends EntityMapper<OrderItemDTO, OrderItem> {
    @Mapping(target = "food", source = "food", qualifiedByName = "foodId")
    @Mapping(target = "order", source = "order", qualifiedByName = "orderId")
    OrderItemDTO toDto(OrderItem s);

    @Named("foodId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "imgUrl", source = "imgUrl")
    @Mapping(target = "imgName", source = "imgName")
    FoodDTO toDtoFoodId(Food food);

    @Named("orderId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    OrderDTO toDtoOrderId(Order order);
}
