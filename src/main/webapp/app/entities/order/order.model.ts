import { IUser } from 'app/entities/user/user.model';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';
import { IOrderItem } from '../order-item/order-item.model';

export interface IOrder {
  id: string;
  status?: keyof typeof OrderStatus | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  orderItems?: IOrderItem[] | null;
  totalQuantity?: number | null;
  totalPrice?: number | null;
  shippingCost?: number | null;
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };
