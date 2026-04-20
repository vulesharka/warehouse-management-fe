export interface TruckResponse {
  id: number;
  chassisNumber: string;
  licensePlate: string;
  containerVolume: number;
}

export interface TruckRequest {
  chassisNumber: string;
  licensePlate: string;
  containerVolume: number;
}
