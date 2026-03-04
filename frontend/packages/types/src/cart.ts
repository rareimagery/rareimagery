import type { Price } from './product';
import type { OrderType } from './order';

export interface Adjustment {
  type: string;
  label: string;
  amount: Price;
  included: boolean;
}

export interface CartItem {
  orderItemId: number;
  uuid: string;
  title: string;
  quantity: number;
  unitPrice: Price;
  totalPrice: Price;
  purchasedEntityId: string;
}

export interface Cart {
  orderId: number;
  uuid: string;
  orderNumber?: string;
  type: OrderType;
  items: CartItem[];
  totalPrice: Price;
  adjustments: Adjustment[];
}

export interface AddToCartRequest {
  purchasedEntityType: string;
  purchasedEntityId: string;
  quantity: number;
}
