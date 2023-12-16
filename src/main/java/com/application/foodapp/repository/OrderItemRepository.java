package com.application.foodapp.repository;

import com.application.foodapp.domain.OrderItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the OrderItem entity.
 */
@Repository
public interface OrderItemRepository extends MongoRepository<OrderItem, String> {
    @Query("{}")
    Page<OrderItem> findAllWithEagerRelationships(Pageable pageable);

    @Query("{}")
    List<OrderItem> findAllWithEagerRelationships();

    @Query("{'id': ?0}")
    Optional<OrderItem> findOneWithEagerRelationships(String id);
    
    Optional<OrderItem> findOneByOrderIdAndFoodId(String orderId, String foodId);
}
