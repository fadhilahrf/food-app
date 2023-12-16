package com.application.foodapp.service.mapper;

import com.application.foodapp.domain.Order;
import com.application.foodapp.domain.User;
import com.application.foodapp.service.dto.OrderDTO;
import com.application.foodapp.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Order} and its DTO {@link OrderDTO}.
 */
@Mapper(componentModel = "spring")
public interface OrderMapper extends EntityMapper<OrderDTO, Order> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    OrderDTO toDto(Order s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
