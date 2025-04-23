import {
  TransactionBaseService,
  MedusaRequest,
  CustomerService,
  RegionService,
  Region, Customer,
  MedusaResponse,
  CartService,
} from '@medusajs/medusa';
import { ICacheService } from '@medusajs/types';
import { LineItem } from '@medusajs/medusa';
import { CreateTempCustomerWithCartDTO } from '../model/guest-cart.dto';
import { SignJWT } from 'jose';
import { MergeCartParams } from '../model/merge-cart.dto';
import { MedusaError } from 'medusa-core-utils';

type Dependencies = {
  customerService: CustomerService;
  regionService: RegionService;
  cacheService: ICacheService;
  cartService: CartService;
};

interface ExtendedCreateCustomerInput {
  email: string;
  is_guest?: boolean;
  device_id: string;
  region_id: string;
}

type ModuleOptions = {

  jwt_secret?: string;
};

export class GuestCartModuleService extends TransactionBaseService {
  private readonly customerService_: CustomerService;
  private readonly regionService_: RegionService;
  private readonly cartService_: CartService;
  private readonly cacheService_: ICacheService;
  protected readonly options_: ModuleOptions;

  constructor(
    { customerService, regionService, cacheService , cartService}: Dependencies,
    options: ModuleOptions
  ) {
    super({ customerService, regionService, cacheService });
    this.customerService_ = customerService;
    this.regionService_ = regionService;
    this.cacheService_ = cacheService;
    this.cartService_ = cartService;
    this.options_ = options;
  }

  async createTempCustomerWithCart(
    params: CreateTempCustomerWithCartDTO,
    req: MedusaRequest
  ): Promise<{ access_token: string }> {
    const { device_id, region_id } = params;

    let region: Region | null = await this.cacheService_.get(`region:${region_id}`);
    if (!region) {
      if (!region_id) {
        throw new Error('Region ID is required');
      }
      region = await this.regionService_.retrieve(region_id);
      if (!region || region.metadata?.enable_guest_user !== 'true') {
        throw new Error('Region not supported for guest customer');
      }
      await this.cacheService_.set(`region:${region_id}`, JSON.stringify(region), 3600);
    } else {
      region = JSON.parse(JSON.stringify(region)); // Ensure proper type handling
    }

    if (!device_id) {
      throw new Error('Device ID is required');
    }
    let customer = await this.getUserByDeviceId(device_id);
    if (!customer) {
      const tempIdentifier = Math.floor(Math.random() * 1000000);
      customer = await this.customerService_.create({
        email: `temp-${tempIdentifier}@example.com`,
        is_guest: true,
        device_id,
        region_id,
      } as ExtendedCreateCustomerInput);
    }

    req.session.customer_id = customer.id;
    const access_token = await this.createCustomerJwt(customer.id, true);

    return { access_token };
  }

  async createCustomerJwt(customerId: string, is_guest = false) {
    // sign token
    if (!this.options_.jwt_secret) {
      throw new Error('Empty jwt secret');
    }

    const secretKey = new TextEncoder().encode(this.options_.jwt_secret);

    const iat = Math.floor(Date.now() / 1000);
    const tokenPayload = { customer_id: customerId, domain: 'store', iat, is_guest };

    return await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime('30d')
      .sign(secretKey);
  }

  private async getUserByDeviceId(device_id: string): Promise<Customer | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const customers = await this.customerService_.list({
      // device_id must be part of your Customer entity if you're using this
      device_id,
    } as any)

    return customers[0] ?? null
  }


   MergeCart = async (data: MergeCartParams , customer_id: string = '') => {
    const {    to_cart_id, from_cart_id  } = data;

    try {
      const customer = await this.customerService_.retrieve(customer_id);
      if (!customer) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Customer not found');
      }
  
      const [toCart, fromCart] = await Promise.all([
        this.cartService_.retrieveWithTotals(to_cart_id ?? ''),
        this.cartService_.retrieveWithTotals(from_cart_id ?? ''),
      ]);
  
      if (!toCart || to_cart_id !== customer.metadata?.cart_id) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, 'First cart not found or invalid ID');
      }
  
      if (!fromCart) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Second cart not found');
      }
  
      const lineItemsToAdd = fromCart.items.map((item: { tax_lines: any; [key: string]: any }) => {
        const { tax_lines, ...rest } = item;
        return rest;
      });
      for (const lineItem of lineItemsToAdd) {
        await this.cartService_.addLineItem(toCart.id, lineItem as any);
      }
  
      await Promise.all(
        lineItemsToAdd.map(async (lineItem) => {
          await this.cartService_.removeLineItem(lineItem.cart_id, lineItem.id);
        }),
      );
  
      return await this.cartService_.retrieveWithTotals(toCart.id);
   
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      throw new MedusaError(MedusaError.Types.NOT_FOUND, errorMessage);
    }
}
}