package com.application.foodapp.repository;

import com.application.foodapp.domain.Food;
import com.application.foodapp.domain.enumeration.Category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Food entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FoodRepository extends MongoRepository<Food, String> {
    
    Page<Food> findAllByCategory(Pageable pageable, Category category);

    Page<Food> findAllByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(Pageable pageable, String name, String description);
   
    @Query("{ $and: [{ $or: [{ name: {$regex: ?0}}, {description: {$regex: ?1}}] }, {category: ?2}] }")
    Page<Food> findAllByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseAndCategory( String name, String description, Category category, Pageable pageable);

}
