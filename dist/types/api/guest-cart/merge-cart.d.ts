import { NextFunction, Request, Response } from 'express';
/**
 * Merges the guest cart with the user cart.
 */
export declare function mergeCart(req: Request, res: Response, next: NextFunction): Promise<void>;
