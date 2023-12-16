import { IUser } from 'app/entities/user/user.model';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';

export interface IOrder {
  id: string;
  status?: keyof typeof OrderStatus | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  totalQuantity?: number | null;
  totalPrice?: number | null;
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };
