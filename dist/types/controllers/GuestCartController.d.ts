import { Request, Response } from "express";
import { GuestCartModuleService } from "../services/guest-cart";
export declare class GuestCartController {
    private guestCartService;
    constructor(guestCartService: GuestCartModuleService);
    createTempCustomer(req: Request, res: Response): Promise<void>;
    mergeCarts(req: Request, res: Response): Promise<void>;
}
