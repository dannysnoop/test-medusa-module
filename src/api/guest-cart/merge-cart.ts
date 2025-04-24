import {
  CartService,
  CustomerService,
  MedusaRequest,
  MedusaResponse,
  RegionService,
} from '@medusajs/medusa';
import { ICacheService } from '@medusajs/types';
import { GuestCartModuleService } from '../../services/guest-cart';
import { MergeCartParams } from '../../model/merge-cart.dto';
import { NextFunction, Request, Response } from 'express';

/**
 * Merges the guest cart with the user cart.
 */
export async function mergeCart(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  try {
    // Cast the request to MedusaRequest to access custom properties
    const medusaReq = req as MedusaRequest<MergeCartParams>;

    // Instantiate the GuestCartModuleService
    const customerService = medusaReq.scope.resolve('customerService') as CustomerService;
    const regionService = medusaReq.scope.resolve('regionService') as RegionService;
    const cartService = medusaReq.scope.resolve('cartService') as CartService;
    const cacheService = medusaReq.scope.resolve('cacheService') as ICacheService;

    const guestCartService = new GuestCartModuleService(
        { customerService, regionService, cacheService, cartService },
        { jwt_secret: process.env.JWT_SECRET },
    );

    const params = medusaReq.body;
    const customer_id = medusaReq.user?.customer_id;

    // Call the mergeCarts method
    const mergedCart = await guestCartService.MergeCart(params, customer_id);

    // Respond with the merged cart
    res.status(200).json({ data: mergedCart });
  } catch (error: any) {
    next(error); // Pass the error to the Express error handler
  }
}