// guest-cart-medusa.d.ts
declare module 'guest-cart-medusa' {
    // Declare the class `GuestCartModuleService` from your service
    export class GuestCartModuleService {
      constructor(
        customerService: any,
        regionService: any,
        cacheService: any,
        options: any
      );
  
      // Methods
      createTempCustomerWithCart(params: any, req: any): Promise<{ access_token: string }>;
      createCustomerJwt(customerId: string, is_guest?: boolean): Promise<string>;
      getUserByDeviceId(device_id: string): Promise<any | null>;
    }
    export function createGuestUser(  req: MedusaRequest<CreateTempCustomerWithCartDTO>,  res: MedusaResponse): Promise<void>;
    export function mergeCart(  req: MedusaRequest<MergeCartParams>,  res: MedusaResponse): Promise<void>;
  }
  