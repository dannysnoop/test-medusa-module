import { TransactionBaseService, MedusaRequest, CustomerService, RegionService, CartService } from '@medusajs/medusa';
import { ICacheService } from '@medusajs/types';
import { CreateTempCustomerWithCartDTO } from '../model/guest-cart.dto';
import { MergeCartParams } from '../model/merge-cart.dto';
type Dependencies = {
    customerService: CustomerService;
    regionService: RegionService;
    cacheService: ICacheService;
    cartService: CartService;
};
type ModuleOptions = {
    jwt_secret?: string;
};
export declare class GuestCartModuleService extends TransactionBaseService {
    private readonly customerService_;
    private readonly regionService_;
    private readonly cartService_;
    private readonly cacheService_;
    protected readonly options_: ModuleOptions;
    constructor({ customerService, regionService, cacheService, cartService }: Dependencies, options: ModuleOptions);
    createTempCustomerWithCart(params: CreateTempCustomerWithCartDTO, req: MedusaRequest): Promise<{
        access_token: string;
    }>;
    createCustomerJwt(customerId: string, is_guest?: boolean): Promise<string>;
    private getUserByDeviceId;
    MergeCart: (data: MergeCartParams, customer_id?: string) => Promise<import("@medusajs/medusa").WithRequiredProperty<import("@medusajs/medusa").Cart, "total">>;
}
export default GuestCartModuleService;
