export class CreateTempCustomerWithCartDTO {
  device_id: string | undefined;
  region_id: string | undefined;
}

export class MergeCart {
  cart_id: string | undefined;
  customer_id: string | undefined;
}
