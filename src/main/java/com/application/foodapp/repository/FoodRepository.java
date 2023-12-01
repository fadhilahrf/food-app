package com.application.foodapp.repository;

import com.application.foodapp.domain.Food;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Food entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FoodRepository extends MongoRepository<Food, String> {}
