export interface IFood {
  id: string;
  name?: string | null;
  price?: number | null;
  imgUrl?: string | null;
  imgFile?: File | null;
  imgName?: string | null;
}

export type NewFood = Omit<IFood, 'id'> & { id: null };
