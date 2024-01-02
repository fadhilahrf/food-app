import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFood, NewFood } from '../food.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFood for edit and NewFoodFormGroupInput for create.
 */
type FoodFormGroupInput = IFood | PartialWithRequiredKeyOf<NewFood>;

type FoodFormDefaults = Pick<NewFood, 'id'>;

type FoodFormGroupContent = {
  id: FormControl<IFood['id'] | NewFood['id']>;
  name: FormControl<IFood['name']>;
  category: FormControl<IFood['category']>;
  description: FormControl<IFood['description']>;
  price: FormControl<IFood['price']>;
  imgUrl: FormControl<IFood['imgUrl']>;
  imgFile: FormControl<IFood['imgFile']>;
  imgName: FormControl<IFood['imgName']>;
};

export type FoodFormGroup = FormGroup<FoodFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FoodFormService {
  createFoodFormGroup(food: FoodFormGroupInput = { id: null }): FoodFormGroup {
    const foodRawValue = {
      ...this.getFormDefaults(),
      ...food,
    };
    return new FormGroup<FoodFormGroupContent>({
      id: new FormControl(
        { value: foodRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(foodRawValue.name, {
        validators: [Validators.required],
      }),
      category: new FormControl(foodRawValue.category, {
        validators: [Validators.required],
      }),
      description: new FormControl(foodRawValue.description),
      price: new FormControl(foodRawValue.price, {
        validators: [Validators.required, Validators.min(0)],
      }),
      imgUrl: new FormControl(foodRawValue.imgUrl),
      imgFile: new FormControl(foodRawValue.imgFile),
      imgName: new FormControl(foodRawValue.imgName),
    });
  }

  getFood(form: FoodFormGroup): IFood | NewFood {
    return form.getRawValue() as IFood | NewFood;
  }

  resetForm(form: FoodFormGroup, food: FoodFormGroupInput): void {
    const foodRawValue = { ...this.getFormDefaults(), ...food };
    form.reset(
      {
        ...foodRawValue,
        id: { value: foodRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FoodFormDefaults {
    return {
      id: null,
    };
  }
}
