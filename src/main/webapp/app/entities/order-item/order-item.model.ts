import { IFood } from 'app/entities/food/food.model';
import { IOrder } from 'app/entities/order/order.model';

export interface IOrderItem {
  id?: string | null;
  price?: number | null;
  food?: IFood | null;
  order?: Pick<IOrder, 'id'> | null;
  quantity?: number | null;
}

export type NewOrderItem = Omit<IOrderItem, 'id'> & { id: null };
