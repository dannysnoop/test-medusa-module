"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGuestUser = createGuestUser;
const guest_cart_1 = require("../../services/guest-cart");
/**
 * Creates a guest user and returns a response with the guest user details.
 */
async function createGuestUser(req, res) {
    // Instantiate required services (these should be retrieved from your dependency injection container)
    const customerService = req.scope.resolve('customerService');
    const regionService = req.scope.resolve('regionService');
    const cacheService = req.scope.resolve('cacheService');
    const cartService = req.scope.resolve('cartService');
    const params = req.body;
    // Instantiate the GuestCartModuleService
    const guestCartService = new guest_cart_1.GuestCartModuleService({ customerService, regionService, cacheService, cartService }, { jwt_secret: process.env.JWT_SECRET });
    try {
        // Call the createTempCustomerWithCart method
        const { access_token } = await guestCartService.createTempCustomerWithCart(params, req);
        // Respond with the access token
        res.status(200).json({ access_token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
//# sourceMappingURL=create-guest-user.js.map