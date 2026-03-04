import type { Price } from './product';

export type OrderType = 'pod_order' | 'custom_order' | 'digital_order';
export type OrderState = 'draft' | 'placed' | 'completed' | 'canceled';

export interface OrderItem {
  uuid: string;
  title: string;
  quantity: number;
  unitPrice: Price;
  totalPrice: Price;
  purchasedEntityUuid: string;
}

export interface Order {
  uuid: string;
  orderNumber: string;
  type: OrderType;
  state: OrderState;
  email: string;
  totalPrice: Price;
  items: OrderItem[];
  createdAt: string;
  completedAt?: string;
}
