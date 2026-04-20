export type OrderStatus =
  | 'CREATED'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'DECLINED'
  | 'UNDER_DELIVERY'
  | 'FULFILLED'
  | 'CANCELED';

export interface OrderItemResponse {
  id: number;
  inventoryItemId: number;
  itemName: string;
  requestedQuantity: number;
  deadlineDate: string;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  submittedDate: string | null;
  createdAt: string;
  clientUsername: string;
  declineReason: string | null;
  items: OrderItemResponse[];
}

export interface OrderSummaryResponse {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  submittedDate: string | null;
  createdAt: string;
  clientUsername: string;
}

export interface OrderItemRequest {
  inventoryItemId: number;
  requestedQuantity: number;
  deadlineDate: string;
}

export interface OrderRequest {
  items: OrderItemRequest[];
}
