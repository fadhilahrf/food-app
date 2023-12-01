import { IFood, NewFood } from './food.model';

export const sampleWithRequiredData: IFood = {
  id: 'c11b8795-0c5f-41f5-b7a1-8ae3011526fd',
  name: 'before pupate solve',
  price: 15060.55,
};

export const sampleWithPartialData: IFood = {
  id: 'd7d012d8-47ff-468d-bd42-f2351b31d767',
  name: 'nervously tremendously',
  price: 3245.72,
};

export const sampleWithFullData: IFood = {
  id: '49236c7c-0210-45c7-a1da-6a31948f09b1',
  name: 'aside very egg',
  price: 23697.63,
  imgUrl: 'kissingly inasmuch',
};

export const sampleWithNewData: NewFood = {
  name: 'toward',
  price: 806.3,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
