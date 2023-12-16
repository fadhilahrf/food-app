package com.application.foodapp.service;

import com.application.foodapp.domain.Order;
import com.application.foodapp.domain.OrderItem;
import com.application.foodapp.repository.OrderItemRepository;
import com.application.foodapp.repository.OrderRepository;
import com.application.foodapp.service.dto.OrderItemDTO;
import com.application.foodapp.service.mapper.OrderItemMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link com.application.foodapp.domain.OrderItem}.
 */
@Service
public class OrderItemService {

    private final Logger log = LoggerFactory.getLogger(OrderItemService.class);

    private final OrderItemRepository orderItemRepository;

    private final OrderRepository orderRepository;

    private final OrderItemMapper orderItemMapper;

    public OrderItemService(OrderItemRepository orderItemRepository, OrderRepository orderRepository, OrderItemMapper orderItemMapper) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemMapper = orderItemMapper;
    }

    /**
     * Save a orderItem.
     *
     * @param orderItemDTO the entity to save.
     * @return the persisted entity.
     */
    public OrderItemDTO saveOrUpdate(OrderItemDTO orderItemDTO) {
        log.debug("Request to save OrderItem : {}", orderItemDTO);
        OrderItem orderItem = orderItemMapper.toEntity(orderItemDTO);

        Optional<OrderItem> currentOrderItemOptional = orderItemRepository.findOneByOrderIdAndFoodId(orderItem.getOrder().getId(), orderItem.getFood().getId());
        if(currentOrderItemOptional.isPresent()){
            orderItemDTO.setId(currentOrderItemOptional.get().getId());

            if(currentOrderItemOptional.get().getId()!=null && orderItem.getQuantity()==0){
                delete(currentOrderItemOptional.get().getId());
                return new OrderItemDTO();
            }

            return update(orderItemDTO, currentOrderItemOptional.get());
        }
        Double price = orderItemDTO.getQuantity()*orderItem.getFood().getPrice();
        Order order = orderRepository.findById(orderItem.getOrder().getId()).get();
        orderItem.setPrice(price);
        orderItem = orderItemRepository.save(orderItem);
        order.setTotalQuantity(order.getTotalQuantity() + orderItem.getQuantity());
        Double totalPrice = order.getTotalPrice() != null ? order.getTotalPrice() : 0;
        order.setTotalPrice(totalPrice + price);
        orderRepository.save(order);
        return orderItemMapper.toDto(orderItem);
    }

    /**
     * Update a orderItem.
     *
     * @param orderItemDTO the entity to save.
     * @return the persisted entity.
     */
    public OrderItemDTO update(OrderItemDTO orderItemDTO, OrderItem currentOrderItem) {
        log.debug("Request to update OrderItem : {}", orderItemDTO);
        OrderItem orderItem = orderItemMapper.toEntity(orderItemDTO);
        Order order = orderRepository.findById(orderItem.getOrder().getId()).get();
        Long totalQuantity = order.getTotalQuantity() - currentOrderItem.getQuantity() + orderItemDTO.getQuantity();
        Double price = orderItemDTO.getQuantity()*orderItem.getFood().getPrice();
        Double totalPrice =( order.getTotalPrice() != null ? order.getTotalPrice() : 0) - currentOrderItem.getPrice() + price;
        order.setTotalQuantity(totalQuantity);
        order.setTotalPrice(totalPrice);
        orderItem.setPrice(price);
        orderItem = orderItemRepository.save(orderItem);
        orderRepository.save(order);
        return orderItemMapper.toDto(orderItem);
    }

    /**
     * Partially update a orderItem.
     *
     * @param orderItemDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<OrderItemDTO> partialUpdate(OrderItemDTO orderItemDTO) {
        log.debug("Request to partially update OrderItem : {}", orderItemDTO);

        return orderItemRepository
            .findById(orderItemDTO.getId())
            .map(existingOrderItem -> {
                orderItemMapper.partialUpdate(existingOrderItem, orderItemDTO);

                return existingOrderItem;
            })
            .map(orderItemRepository::save)
            .map(orderItemMapper::toDto);
    }

    /**
     * Get all the orderItems.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<OrderItemDTO> findAll(Pageable pageable) {
        log.debug("Request to get all OrderItems");
        return orderItemRepository.findAll(pageable).map(orderItemMapper::toDto);
    }

    /**
     * Get all the orderItems with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<OrderItemDTO> findAllWithEagerRelationships(Pageable pageable) {
        return orderItemRepository.findAllWithEagerRelationships(pageable).map(orderItemMapper::toDto);
    }

    /**
     * Get one orderItem by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<OrderItemDTO> findOne(String id) {
        log.debug("Request to get OrderItem : {}", id);
        return orderItemRepository.findOneWithEagerRelationships(id).map(orderItemMapper::toDto);
    }

    public Optional<OrderItemDTO> findOneByOrderIdAndFoodId(String orderId, String foodId){
        log.debug("Request to get findOneByOrderIdAndFoodId : {} {}", orderId, foodId);
        return orderItemRepository.findOneByOrderIdAndFoodId(orderId, foodId).map(orderItemMapper::toDto);
    }

    /**
     * Delete the orderItem by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        log.debug("Request to delete OrderItem : {}", id);
        OrderItemDTO orderItemDTO = findOne(id).get();
        Order order = orderRepository.findById(orderItemDTO.getOrder().getId()).get();

        order.setTotalQuantity(order.getTotalQuantity() - orderItemDTO.getQuantity());
        order.setTotalPrice(order.getTotalPrice() - orderItemDTO.getPrice());

        orderItemRepository.deleteById(id);
        orderRepository.save(order);
    }
}
