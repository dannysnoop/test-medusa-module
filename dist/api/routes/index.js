"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_guest_user_1 = require("../guest-cart/create-guest-user");
const merge_cart_1 = require("../guest-cart/merge-cart");
const route = (0, express_1.Router)();
const setupRoutes = (app) => {
    app.use("/api", route);
    route.post("/create-guest-user", create_guest_user_1.createGuestUser);
    route.post("/merge-cart", merge_cart_1.mergeCart);
    return app;
};
exports.default = setupRoutes;
//# sourceMappingURL=index.js.map