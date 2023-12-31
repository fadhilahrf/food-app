import { Category } from "../enumerations/category.model";

export interface IFood {
  id: string;
  name?: string | null;
  category?: keyof typeof Category | null;
  description?: string | null;
  price?: number | null;
  imgUrl?: string | null;
  imgFile?: File | null;
  imgName?: string | null;
  quantity?: number | null;
}

export type NewFood = Omit<IFood, 'id'> & { id: null };

export interface IFoodVM {
  food?: IFood | null;
  orderedQuantity?: number | null;
}