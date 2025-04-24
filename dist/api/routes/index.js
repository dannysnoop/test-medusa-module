"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_guest_user_1 = require("../guest-cart/create-guest-user");
const merge_cart_1 = require("../guest-cart/merge-cart");
const middlewares_1 = require("../middlewares");
const route = (0, express_1.Router)();
const setupRoutes = (app) => {
    app.use("/store", route);
    route.post("/guest-cart", middlewares_1.checkGuestCustomer, create_guest_user_1.createGuestUser);
    route.post("/guest-cart/merge-cart", middlewares_1.checkGuestCustomer, merge_cart_1.mergeCart);
    return app;
};
exports.default = setupRoutes;
//# sourceMappingURL=index.js.map