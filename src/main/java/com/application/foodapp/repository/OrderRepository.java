package com.application.foodapp.repository;

import com.application.foodapp.domain.Order;
import com.application.foodapp.domain.User;
import com.application.foodapp.domain.enumeration.OrderStatus;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Order entity.
 */
@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    @Query("{}")
    Page<Order> findAllWithEagerRelationships(Pageable pageable);

    @Query("{}")
    List<Order> findAllWithEagerRelationships();

    @Query("{'id': ?0}")
    Optional<Order> findOneWithEagerRelationships(String id);

    Optional<Order> findFirstByUserAndStatus(User user, OrderStatus status);
    
    Page<Order> findAllByUser(User user, Pageable pageable);
}
