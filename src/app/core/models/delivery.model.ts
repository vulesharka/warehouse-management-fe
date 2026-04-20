import { TruckResponse } from './truck.model';

export interface DeliveryResponse {
  id: number;
  orderId: number;
  orderNumber: string;
  deliveryDate: string;
  trucks: TruckResponse[];
}

export interface ScheduleDeliveryRequest {
  deliveryDate: string;
  truckIds: number[];
}

export interface AvailableDaysResponse {
  availableDays: string[];
}
