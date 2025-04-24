"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeCart = mergeCart;
const guest_cart_1 = require("../../services/guest-cart");
/**
 * Merges the guest cart with the user cart.
 */
async function mergeCart(req, res, next) {
    try {
        // Cast the request to MedusaRequest to access custom properties
        const medusaReq = req;
        // Instantiate the GuestCartModuleService
        const customerService = medusaReq.scope.resolve('customerService');
        const regionService = medusaReq.scope.resolve('regionService');
        const cartService = medusaReq.scope.resolve('cartService');
        const cacheService = medusaReq.scope.resolve('cacheService');
        const guestCartService = new guest_cart_1.GuestCartModuleService({ customerService, regionService, cacheService, cartService }, { jwt_secret: process.env.JWT_SECRET });
        const params = medusaReq.body;
        const customer_id = medusaReq.user?.customer_id;
        // Call the mergeCarts method
        const mergedCart = await guestCartService.MergeCart(params, customer_id);
        // Respond with the merged cart
        res.status(200).json({ data: mergedCart });
    }
    catch (error) {
        next(error); // Pass the error to the Express error handler
    }
}
//# sourceMappingURL=merge-cart.js.map