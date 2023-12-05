export interface IFood {
  id: string;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  imgUrl?: string | null;
  imgFile?: File | null;
  imgName?: string | null;
  quantity?: number | null;
}

export type NewFood = Omit<IFood, 'id'> & { id: null };
