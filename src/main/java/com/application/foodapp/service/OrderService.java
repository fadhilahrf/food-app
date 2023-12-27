package com.application.foodapp.service;

import com.application.foodapp.domain.Order;
import com.application.foodapp.domain.User;
import com.application.foodapp.domain.enumeration.OrderStatus;
import com.application.foodapp.repository.OrderRepository;
import com.application.foodapp.repository.UserRepository;
import com.application.foodapp.security.SecurityUtils;
import com.application.foodapp.service.dto.OrderDTO;
import com.application.foodapp.service.dto.OrderItemDTO;
import com.application.foodapp.service.dto.UserDTO;
import com.application.foodapp.service.mapper.OrderMapper;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link com.application.foodapp.domain.Order}.
 */
@Service
public class OrderService {

    private final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;

    private final OrderItemService orderItemService;

    private final UserRepository userRepository;

    private final OrderMapper orderMapper;

    public OrderService(OrderRepository orderRepository, OrderItemService orderItemService, UserRepository userRepository, OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.orderItemService = orderItemService;
        this.userRepository = userRepository;
        this.orderMapper = orderMapper;
    }

    /**
     * Save a order.
     *
     * @param orderDTO the entity to save.
     * @return the persisted entity.
     */
    public OrderDTO save(OrderDTO orderDTO) {
        log.debug("Request to save Order : {}", orderDTO);
        Order order = orderMapper.toEntity(orderDTO);
        order = orderRepository.save(order);
        return orderMapper.toDto(order);
    }

    public OrderDTO createNewWithCurrentUser() {
        log.debug("Request to saveWithCurrentUser ");
        OrderDTO orderDTO = new OrderDTO();
        String login = SecurityUtils.getCurrentUserLogin().get();
        User user = userRepository.findOneByLogin(login).get();
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());

        orderDTO.setUser(userDTO);
        orderDTO.setStatus(OrderStatus.ACTIVE);
        orderDTO.setTotalQuantity(0L);
        
        Order order = orderMapper.toEntity(orderDTO);
        order = orderRepository.save(order);
        return orderMapper.toDto(order);
    }

    /**
     * Update a order.
     *
     * @param orderDTO the entity to save.
     * @return the persisted entity.
     */
    public OrderDTO update(OrderDTO orderDTO) {
        log.debug("Request to update Order : {}", orderDTO);
        Order order = orderMapper.toEntity(orderDTO);
        order = orderRepository.save(order);
        return orderMapper.toDto(order);
    }

    /**
     * Partially update a order.
     *
     * @param orderDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<OrderDTO> partialUpdate(OrderDTO orderDTO) {
        log.debug("Request to partially update Order : {}", orderDTO);

        return orderRepository
            .findById(orderDTO.getId())
            .map(existingOrder -> {
                orderMapper.partialUpdate(existingOrder, orderDTO);

                return existingOrder;
            })
            .map(orderRepository::save)
            .map(orderMapper::toDto);
    }

    /**
     * Get all the orders.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<OrderDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Orders");
        return orderRepository.findAll(pageable).map(orderMapper::toDto);
    }

    /**
     * Get all the orders with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<OrderDTO> findAllWithEagerRelationships(Pageable pageable) {
        return orderRepository.findAllWithEagerRelationships(pageable).map(orderMapper::toDto);
    }

    /**
     * Get one order by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<OrderDTO> findOne(String id) {
        log.debug("Request to get Order : {}", id);
        return orderRepository.findOneWithEagerRelationships(id).map(order->{
            OrderDTO orderDTO = orderMapper.toDto(order);

            List<OrderItemDTO> orderItemDTOs = orderItemService.findAllByOrderId(id);

            orderDTO.setOrderItems(orderItemDTOs);
            return orderDTO;
        });
    }

    public Optional<OrderDTO> findFirstByCurrentUserAndStatusIsActive() {
        log.debug("Request to findFirstByCurrentUserAndStatusIsActive");
        String login = SecurityUtils.getCurrentUserLogin().get();
        Optional<User> userOptional = userRepository.findOneByLogin(login);
        if(userOptional.isPresent()){
            Optional<Order> orderOptional = orderRepository.findFirstByUserAndStatus(userOptional.get(), OrderStatus.ACTIVE);
            if(orderOptional.isEmpty()){
                return Optional.of(createNewWithCurrentUser());
            }
            return orderOptional.map(order->{
                OrderDTO orderDTO = orderMapper.toDto(order);

                List<OrderItemDTO> orderItemDTOs = orderItemService.findAllByOrderId(orderDTO.getId());

                orderDTO.setOrderItems(orderItemDTOs);
                return orderDTO;
            });
        }
        return Optional.empty();
    }

    public Long getTotalQuantity() {
        Optional<OrderDTO> orderOptional = findFirstByCurrentUserAndStatusIsActive();

        if(orderOptional.isPresent()){
            return orderOptional.get().getTotalQuantity();
        }

        return 0L;
    }

    public OrderDTO setCurrentOrderStatus(OrderStatus orderStatus) {
        Optional<OrderDTO> orderOptional = findFirstByCurrentUserAndStatusIsActive();

        if(orderOptional.isPresent()){
            OrderDTO orderDTO = orderOptional.get();
            Order order = orderMapper.toEntity(orderDTO);
            order.setStatus(orderStatus);
            return orderMapper.toDto(orderRepository.save(order));
        }

        return new OrderDTO();
    }

    /**
     * Delete the order by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        log.debug("Request to delete Order : {}", id);
        orderRepository.deleteById(id);
    }
}
