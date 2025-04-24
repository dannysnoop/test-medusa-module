// src/controllers/GuestCartController.ts
import { Request, Response } from "express";
import { GuestCartModuleService } from "../services/guest-cart";

export class GuestCartController {
  private guestCartService: GuestCartModuleService;

  constructor(guestCartService: GuestCartModuleService) {
    this.guestCartService = guestCartService;
  }

  // Create a temporary customer and generate an access token
  async createTempCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { params } = req.body;
      const result = await this.guestCartService.createTempCustomerWithCart(params, req);
      res.status(200).json(result);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Merge carts
  async mergeCarts(req: Request, res: Response): Promise<void> {
    try {
      const { data } = req.body;
      const result = await this.guestCartService.MergeCart(data);
      res.status(200).json(result);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }
}
