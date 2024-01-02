package com.application.foodapp.service;

import com.application.foodapp.domain.Food;
import com.application.foodapp.domain.enumeration.Category;
import com.application.foodapp.repository.FoodRepository;
import com.application.foodapp.service.dto.FoodDTO;
import com.application.foodapp.service.dto.OrderDTO;
import com.application.foodapp.service.dto.OrderItemDTO;
import com.application.foodapp.service.mapper.FoodMapper;
import com.application.foodapp.web.rest.vm.FoodVM;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service Implementation for managing {@link com.application.foodapp.domain.Food}.
 */
@Service
public class FoodService {

    private final Logger log = LoggerFactory.getLogger(FoodService.class);

    private final FoodRepository foodRepository;

    private final OrderService orderService;

    private final OrderItemService orderItemService;

    private final FirebaseService firebaseService;

    private final FoodMapper foodMapper;

    @Value("${firebase.storage.bucket-name}")
    private String bucketName;

    @Value("${firebase.storage.media-path}")
    private String mediaPath;

    public FoodService(FoodRepository foodRepository, OrderService orderService, OrderItemService orderItemService, FoodMapper foodMapper, FirebaseService firebaseService) {
        this.foodRepository = foodRepository;
        this.orderService = orderService;
        this.orderItemService = orderItemService;
        this.foodMapper = foodMapper;
        this.firebaseService = firebaseService;
    }

    /**
     * Save a food.
     *
     * @param foodDTO the entity to save.
     * @return the persisted entity.
     */
    public FoodDTO save(FoodDTO foodDTO) {
        log.debug("Request to save Food : {}", foodDTO);
        Food food = foodMapper.toEntity(foodDTO);
        food = foodRepository.save(food);
        return foodMapper.toDto(food);
    }

    public FoodDTO uploadImage(String id, MultipartFile imgFile) {
        log.debug("Request to upload Food image: {}", id);
        Optional<Food> foodOptional = foodRepository.findById(id);
        if(foodOptional.isPresent()){
            Food food = foodOptional.get();
            if(imgFile != null){
            try {
                String imgName = firebaseService.uploadImage(imgFile);
                String imgUrl =  String.format(mediaPath, imgName);
                food.setImgName(imgName);
                food.setImgUrl(imgUrl);
            } catch (Exception e) {
                e.printStackTrace();
            }
                food = foodRepository.save(food);
            }
            return foodMapper.toDto(food);
        }
        return null;
    }

    /**
     * Update a food.
     *
     * @param foodDTO the entity to save.
     * @return the persisted entity.
     */
    public FoodDTO update(FoodDTO foodDTO) throws Exception {
        log.debug("Request to update Food : {}", foodDTO);

        Food oldFood = foodRepository.findById(foodDTO.getId()).get();
        foodMapper.partialUpdate(oldFood, foodDTO);
        if((foodDTO.getImgUrl() == null || foodDTO.getImgUrl().isBlank()) && !foodDTO.getImgName().isBlank() ){
            firebaseService.deleteImage(oldFood.getImgName());
            oldFood.setImgName("");
            oldFood.setImgUrl("");
        }

        oldFood = foodRepository.save(oldFood);
        return foodMapper.toDto(oldFood);
    }

    /**
     * Partially update a food.
     *
     * @param foodDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<FoodDTO> partialUpdate(FoodDTO foodDTO) {
        log.debug("Request to partially update Food : {}", foodDTO);

        return foodRepository
            .findById(foodDTO.getId())
            .map(existingFood -> {
                foodMapper.partialUpdate(existingFood, foodDTO);

                return existingFood;
            })
            .map(foodRepository::save)
            .map(foodMapper::toDto);
    }

    /**
     * Get all the foods.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<FoodDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Foods");
        return foodRepository.findAll(pageable).map(foodMapper::toDto);
    }

    public Page<FoodVM> findAllForMarketplace(Pageable pageable, String category, String search) {
        Optional<OrderDTO> orderOptional = orderService.findFirstByCurrentUserAndStatusIsActive();
        Page<Food> query;
        Category c;
        if (StringUtils.isNotBlank(search) && StringUtils.isNotBlank(category)) {
            c = Category.valueOf(category);
            query = foodRepository.findAllByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseAndCategory(search, search, c, pageable);
        }else if (StringUtils.isNotBlank(search)) {
            query = foodRepository.findAllByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(pageable, search, search);
        }else if (StringUtils.isNotBlank(category)) {
            c = Category.valueOf(category);
            query = foodRepository.findAllByCategory(pageable, c);
        }else {
            query = foodRepository.findAll(pageable);
        }

        return query.map(food->{
            FoodVM foodVM = new FoodVM();
            foodVM.setFood(foodMapper.toDto(food));
            foodVM.setOrderedQuantity(0L);
            if(orderOptional.isPresent()){
                Optional<OrderItemDTO> orderItemDTO = orderItemService.findOneByOrderIdAndFoodId(orderOptional.get().getId(), food.getId());
                
                if(orderItemDTO.isPresent()){
                    foodVM.setOrderedQuantity(orderItemDTO.get().getQuantity());
                }
            }
            return foodVM;
        });
    }

    public List<FoodVM> findFoodsInUserCart() {
        Optional<OrderDTO> orderOptional = orderService.findFirstByCurrentUserAndStatusIsActive();
        if(orderOptional.isPresent()){
            return orderItemService.findAllByOrderId(orderOptional.get().getId()).stream().map(orderItem->{
                FoodVM foodVM = new FoodVM();
                foodVM.setFood(orderItem.getFood());
                foodVM.setOrderedQuantity(orderItem.getQuantity());
                return foodVM;
            }).toList();
        }
        return new ArrayList<>();
    }

    /**
     * Get one food by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<FoodDTO> findOne(String id) {
        log.debug("Request to get Food : {}", id);
        return foodRepository.findById(id).map(foodMapper::toDto);
    }

    public Optional<FoodVM> findOneForMarketplace(String id) {
        log.debug("Request to findOneForMarketplace : {}", id);
        Optional<OrderDTO> orderOptional = orderService.findFirstByCurrentUserAndStatusIsActive();
        return foodRepository.findById(id).map(food->{
            FoodVM foodVM = new FoodVM();
            foodVM.setFood(foodMapper.toDto(food));
            foodVM.setOrderedQuantity(0L);
            if(orderOptional.isPresent()){
                Optional<OrderItemDTO> orderItemDTO = orderItemService.findOneByOrderIdAndFoodId(orderOptional.get().getId(), food.getId());
                
                if(orderItemDTO.isPresent()){
                    foodVM.setOrderedQuantity(orderItemDTO.get().getQuantity());
                }
            }
            return foodVM;
        });
    }

    /**
     * Delete the food by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) throws Exception {
        log.debug("Request to delete Food : {}", id);
        Food food = foodRepository.findById(id).get();
        if(food.getImgName() != null && !food.getImgName().isBlank()){
            firebaseService.deleteImage(food.getImgName());
        }
        foodRepository.deleteById(id);
    }
}
