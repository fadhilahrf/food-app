package com.application.foodapp.service.mapper;

import com.application.foodapp.domain.Food;
import com.application.foodapp.service.dto.FoodDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Food} and its DTO {@link FoodDTO}.
 */
@Mapper(componentModel = "spring")
public interface FoodMapper extends EntityMapper<FoodDTO, Food> {}
