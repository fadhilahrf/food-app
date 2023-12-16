package com.application.foodapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.application.foodapp.IntegrationTest;
import com.application.foodapp.domain.OrderItem;
import com.application.foodapp.repository.OrderItemRepository;
import com.application.foodapp.service.OrderItemService;
import com.application.foodapp.service.dto.OrderItemDTO;
import com.application.foodapp.service.mapper.OrderItemMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link OrderItemResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class OrderItemResourceIT {

    private static final Double DEFAULT_PRICE = 0D;
    private static final Double UPDATED_PRICE = 1D;

    private static final String ENTITY_API_URL = "/api/order-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Mock
    private OrderItemRepository orderItemRepositoryMock;

    @Autowired
    private OrderItemMapper orderItemMapper;

    @Mock
    private OrderItemService orderItemServiceMock;

    @Autowired
    private MockMvc restOrderItemMockMvc;

    private OrderItem orderItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderItem createEntity() {
        OrderItem orderItem = new OrderItem().price(DEFAULT_PRICE);
        return orderItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderItem createUpdatedEntity() {
        OrderItem orderItem = new OrderItem().price(UPDATED_PRICE);
        return orderItem;
    }

    @BeforeEach
    public void initTest() {
        orderItemRepository.deleteAll();
        orderItem = createEntity();
    }

    @Test
    void createOrderItem() throws Exception {
        int databaseSizeBeforeCreate = orderItemRepository.findAll().size();
        // Create the OrderItem
        OrderItemDTO orderItemDTO = orderItemMapper.toDto(orderItem);
        restOrderItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderItemDTO)))
            .andExpect(status().isCreated());

        // Validate the OrderItem in the database
        List<OrderItem> orderItemList = orderItemRepository.findAll();
        assertThat(orderItemList).hasSize(databaseSizeBeforeCreate + 1);
        OrderItem testOrderItem = orderItemList.get(orderItemList.size() - 1);
        assertThat(testOrderItem.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    void createOrderItemWithExistingId() throws Exception {
        // Create the OrderItem with an existing ID
        orderItem.setId("existing_id");
        OrderItemDTO orderItemDTO = orderItemMapper.toDto(orderItem);

        int databaseSizeBeforeCreate = orderItemRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderItemDTO)))
            .andExpect(status().isBadRequest());

        // Validate the OrderItem in the database
        List<OrderItem> orderItemList = orderItemRepository.findAll();
        assertThat(orderItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllOrderItems() throws Exception {
        // Initialize the database
        orderItemRepository.save(orderItem);

        // Get all the orderItemList
        restOrderItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderItem.getId())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOrderItemsWithEagerRelationshipsIsEnabled() throws Exception {
        when(orderItemServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOrderItemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(orderItemServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOrderItemsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(orderItemServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOrderItemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(orderItemRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    void getOrderItem() throws Exception {
        // Initialize the database
        orderItemRepository.save(orderItem);

        // Get the orderItem
        restOrderItemMockMvc
            .perform(get(ENTITY_API_URL_ID, orderItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orderItem.getId()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()));
    }

    @Test
    void getNonExistingOrderItem() throws Exception {
        // Get the orderItem
        restOrderItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingOrderItem() throws Exception {
        // Initialize the database
        orderItemRepository.save(orderItem);

        int databaseSizeBeforeUpdate = orderItemRepository.findAll().size();

        // Update the orderItem
        OrderItem updatedOrderItem = orderItemRepository.findById(orderItem.getId()).orElseThrow();
        updatedOrderItem.price(UPDATED_PRICE);
        OrderItemDTO orderItemDTO = orderItemMapper.toDto(updatedOrderItem);

        restOrderItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orderItemDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderItemDTO))
            )
            .andExpect(status().isOk());

        // Validate the OrderItem in the database
        List<OrderItem> orderItemList = orderItemRepository.findAll();
        assertThat(orderItemList).hasSize(databaseSizeBeforeUpdate);
        OrderItem testOrderItem = orderItemList.get(orderItemList.size() - 1);
        assertThat(testOrderItem.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    void putNonExistingOrderItem() throws Exception {
        int databaseSizeBeforeUpdate = orderItemRepository.findAll().size();
        orderItem.setId(UUID.randomUUID().toString());

        // Create the OrderItem
        OrderItemDTO orderItemDTO = orderItemMapper.toDto(orderItem);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orderItemDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderItem in the database
        List<OrderItem> orderItemList = orderItemRepository.findAll();
        assertThat(orderItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchOrderItem() throws Exception {
        int databaseSizeBeforeUpdate = orderItemRepository.findAll().size();
        orderItem.setId(UUID.randomUUID().toString());

        // Create the OrderItem
        OrderItemDTO orderItemDTO = orderItemMapper.toDto(orderItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderItem in the database
        List<OrderItem> orderItemList = orderItemRepository.findAll();
        assertThat(orderItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamOrderItem() throws Exception {
        int databaseSizeBeforeUpdate = orderItemRepository.findAll().size();
        orderItem.setId(UUID.randomUUID().toString());

        // Create the OrderItem
        OrderItemDTO orderItemDTO = orderItemMapper.toDto(orderItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderItemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderItemDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderItem in the database
        List<OrderItem> orderItemList = orderItemRepository.findAll();
        assertThat(orderItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateOrderItemWithPatch() throws Exception {
        // Initialize the database
        orderItemRepository.save(orderItem);

        int databaseSizeBeforeUpdate = orderItemRepository.findAll().size();

        // Update the orderItem using partial update
        OrderItem partialUpdatedOrderItem = new OrderItem();
        partialUpdatedOrderItem.setId(orderItem.getId());

        partialUpdatedOrderItem.price(UPDATED_PRICE);

        restOrderItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderItem))
            )
            .andExpect(status().isOk());

        // Validate the OrderItem in the database
        List<OrderItem> orderItemList = orderItemRepository.findAll();
        assertThat(orderItemList).hasSize(databaseSizeBeforeUpdate);
        OrderItem testOrderItem = orderItemList.get(orderItemList.size() - 1);
        assertThat(testOrderItem.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    void fullUpdateOrderItemWithPatch() throws Exception {
        // Initialize the database
        orderItemRepository.save(orderItem);

        int databaseSizeBeforeUpdate = orderItemRepository.findAll().size();

        // Update the orderItem using partial update
        OrderItem partialUpdatedOrderItem = new OrderItem();
        partialUpdatedOrderItem.setId(orderItem.getId());

        partialUpdatedOrderItem.price(UPDATED_PRICE);

        restOrderItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderItem))
            )
            .andExpect(status().isOk());

        // Validate the OrderItem in the database
        List<OrderItem> orderItemList = orderItemRepository.findAll();
        assertThat(orderItemList).hasSize(databaseSizeBeforeUpdate);
        OrderItem testOrderItem = orderItemList.get(orderItemList.size() - 1);
        assertThat(testOrderItem.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    void patchNonExistingOrderItem() throws Exception {
        int databaseSizeBeforeUpdate = orderItemRepository.findAll().size();
        orderItem.setId(UUID.randomUUID().toString());

        // Create the OrderItem
        OrderItemDTO orderItemDTO = orderItemMapper.toDto(orderItem);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, orderItemDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orderItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderItem in the database
        List<OrderItem> orderItemList = orderItemRepository.findAll();
        assertThat(orderItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchOrderItem() throws Exception {
        int databaseSizeBeforeUpdate = orderItemRepository.findAll().size();
        orderItem.setId(UUID.randomUUID().toString());

        // Create the OrderItem
        OrderItemDTO orderItemDTO = orderItemMapper.toDto(orderItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orderItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderItem in the database
        List<OrderItem> orderItemList = orderItemRepository.findAll();
        assertThat(orderItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamOrderItem() throws Exception {
        int databaseSizeBeforeUpdate = orderItemRepository.findAll().size();
        orderItem.setId(UUID.randomUUID().toString());

        // Create the OrderItem
        OrderItemDTO orderItemDTO = orderItemMapper.toDto(orderItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderItemMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(orderItemDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderItem in the database
        List<OrderItem> orderItemList = orderItemRepository.findAll();
        assertThat(orderItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteOrderItem() throws Exception {
        // Initialize the database
        orderItemRepository.save(orderItem);

        int databaseSizeBeforeDelete = orderItemRepository.findAll().size();

        // Delete the orderItem
        restOrderItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, orderItem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrderItem> orderItemList = orderItemRepository.findAll();
        assertThat(orderItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
