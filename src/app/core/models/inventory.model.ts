export interface InventoryItemResponse {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  packageVolume: number;
}

export interface InventoryItemRequest {
  name: string;
  quantity: number;
  unitPrice: number;
  packageVolume: number;
}
