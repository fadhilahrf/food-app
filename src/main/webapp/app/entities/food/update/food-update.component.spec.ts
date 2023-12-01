import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FoodService } from '../service/food.service';
import { IFood } from '../food.model';
import { FoodFormService } from './food-form.service';

import { FoodUpdateComponent } from './food-update.component';

describe('Food Management Update Component', () => {
  let comp: FoodUpdateComponent;
  let fixture: ComponentFixture<FoodUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let foodFormService: FoodFormService;
  let foodService: FoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FoodUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FoodUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FoodUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    foodFormService = TestBed.inject(FoodFormService);
    foodService = TestBed.inject(FoodService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const food: IFood = { id: 'CBA' };

      activatedRoute.data = of({ food });
      comp.ngOnInit();

      expect(comp.food).toEqual(food);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFood>>();
      const food = { id: 'ABC' };
      jest.spyOn(foodFormService, 'getFood').mockReturnValue(food);
      jest.spyOn(foodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ food });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: food }));
      saveSubject.complete();

      // THEN
      expect(foodFormService.getFood).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(foodService.update).toHaveBeenCalledWith(expect.objectContaining(food));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFood>>();
      const food = { id: 'ABC' };
      jest.spyOn(foodFormService, 'getFood').mockReturnValue({ id: null });
      jest.spyOn(foodService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ food: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: food }));
      saveSubject.complete();

      // THEN
      expect(foodFormService.getFood).toHaveBeenCalled();
      expect(foodService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFood>>();
      const food = { id: 'ABC' };
      jest.spyOn(foodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ food });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(foodService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
