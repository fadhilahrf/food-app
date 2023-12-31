import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrder, NewOrder } from '../order.model';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';

export type PartialUpdateOrder = Partial<IOrder> & Pick<IOrder, 'id'>;

export type EntityResponseType = HttpResponse<IOrder>;
export type EntityArrayResponseType = HttpResponse<IOrder[]>;

@Injectable({ providedIn: 'root' })
export class OrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/orders');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(order: NewOrder): Observable<EntityResponseType> {
    return this.http.post<IOrder>(this.resourceUrl, order, { observe: 'response' });
  }

  update(order: IOrder): Observable<EntityResponseType> {
    return this.http.put<IOrder>(`${this.resourceUrl}/${this.getOrderIdentifier(order)}`, order, { observe: 'response' });
  }

  partialUpdate(order: PartialUpdateOrder): Observable<EntityResponseType> {
    return this.http.patch<IOrder>(`${this.resourceUrl}/${this.getOrderIdentifier(order)}`, order, { observe: 'response' });
  }

  setCurrentOrderStatus(orderStatus: String): Observable<EntityResponseType> {
    return this.http.patch<IOrder>(`${this.resourceUrl}/status`, orderStatus, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findWithAuthorizedUser(id: string): Observable<EntityResponseType> {
    return this.http.get<IOrder>(`${this.resourceUrl}/${id}/current-user`, { observe: 'response' });
  }

  findByCurrentUserAndStatusIsActive(): Observable<EntityResponseType> {
    return this.http.get<IOrder>(`${this.resourceUrl}/active-order-by-current-user`, { observe: 'response' });
  }

  findAllByCurrentUser(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrder[]>(`${this.resourceUrl}/current-user`, { params: options, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getTotalQuantity(): Observable<HttpResponse<number>> {
    return this.http.get<number>(`${this.resourceUrl}/get-total-quantity`, { observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOrderIdentifier(order: Pick<IOrder, 'id'>): string {
    return order.id;
  }

  compareOrder(o1: Pick<IOrder, 'id'> | null, o2: Pick<IOrder, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrderIdentifier(o1) === this.getOrderIdentifier(o2) : o1 === o2;
  }

  addOrderToCollectionIfMissing<Type extends Pick<IOrder, 'id'>>(
    orderCollection: Type[],
    ...ordersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const orders: Type[] = ordersToCheck.filter(isPresent);
    if (orders.length > 0) {
      const orderCollectionIdentifiers = orderCollection.map(orderItem => this.getOrderIdentifier(orderItem)!);
      const ordersToAdd = orders.filter(orderItem => {
        const orderIdentifier = this.getOrderIdentifier(orderItem);
        if (orderCollectionIdentifiers.includes(orderIdentifier)) {
          return false;
        }
        orderCollectionIdentifiers.push(orderIdentifier);
        return true;
      });
      return [...ordersToAdd, ...orderCollection];
    }
    return orderCollection;
  }
}
