import {
  MedusaRequest,
  MedusaResponse,
  CustomerService,
  RegionService,
  CartService,
} from '@medusajs/medusa';

import { ICacheService } from '@medusajs/types';
import { CreateTempCustomerWithCartDTO } from '../../model/guest-cart.dto';
import { GuestCartModuleService } from '../../services/guest-cart';

/**
 * Creates a guest user and returns a response with the guest user details.
 */
export async function createGuestUser(
    req:any,
    res: any,
): Promise<void> {
  // Instantiate required services (these should be retrieved from your dependency injection container)
  const customerService = req.scope.resolve('customerService') as CustomerService;
  const regionService = req.scope.resolve('regionService') as RegionService;
  const cacheService = req.scope.resolve('cacheService') as ICacheService;
  const cartService = req.scope.resolve('cartService') as CartService;

  const params = req.body;
  // Instantiate the GuestCartModuleService
  const guestCartService = new GuestCartModuleService(
    { customerService, regionService, cacheService, cartService },
    { jwt_secret: process.env.JWT_SECRET },
  );

  try {
    // Call the createTempCustomerWithCart method
    const { access_token } = await guestCartService.createTempCustomerWithCart(params, req);

    // Respond with the access token
    res.status(200).json({ access_token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
