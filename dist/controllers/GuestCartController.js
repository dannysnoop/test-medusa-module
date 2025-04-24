"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestCartController = void 0;
class GuestCartController {
    guestCartService;
    constructor(guestCartService) {
        this.guestCartService = guestCartService;
    }
    // Create a temporary customer and generate an access token
    async createTempCustomer(req, res) {
        try {
            const { params } = req.body;
            const result = await this.guestCartService.createTempCustomerWithCart(params, req);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Merge carts
    async mergeCarts(req, res) {
        try {
            const { data } = req.body;
            const result = await this.guestCartService.MergeCart(data);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.GuestCartController = GuestCartController;
//# sourceMappingURL=GuestCartController.js.map