"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.checkGuestCustomer = void 0;
const utils_1 = require("@medusajs/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkGuestCustomer = (req, res, next) => {
    try {
        const token = extractTokenFromHeader(req);
        if (req.baseUrl === '/store/guest-cart/merge-cart' && !token) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.UNAUTHORIZED, 'Authorization header is required for this endpoint.');
        }
        // Proceed to next middleware if no token is found (or token is not relevant for guest-cart merge)
        if (!token) {
            next();
            return;
        }
        const decoded = jsonwebtoken_1.default.decode(token);
        const isGuest = isGuestCustomer(decoded);
        // Block guest users from accessing restricted GET endpoint
        if (isGuest && isGuestAccessingRestrictedEndpoint(req)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, 'Access to this endpoint is not allowed.');
        }
        // Handle POST requests for guest users
        if (isModifyingRequest(req)) {
            handleGuestCustomerPostRequest(req, isGuest);
            next();
            return;
        }
        // Proceed to next middleware if none of the conditions apply
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkGuestCustomer = checkGuestCustomer;
exports.config = {
    routes: [
        {
            matcher: "",
            middlewares: [
                exports.checkGuestCustomer
            ],
        },
    ],
};
const isGuestCustomer = (decoded) => decoded.is_guest;
const isGuestAccessingRestrictedEndpoint = (req) => {
    return req.method === 'GET' && req.baseUrl === '/store/customers/me';
};
const isModifyingRequest = (req) => req.method === 'POST' ||
    req.method === 'DELETE' ||
    req.method === 'PUT' ||
    req.method === 'UPDATE';
const isLineItemEndpoint = (req) => {
    return /^\/store\/carts(\/[^/]+\/line-items(\/[^/]+)?)$/.test(req.baseUrl);
};
const isStoreCartEndpoint = (req) => {
    return /^\/store\/carts$/.test(req.baseUrl);
};
// Function to validate authorization header and extract token
const extractTokenFromHeader = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.split(' ')[1];
};
// Function to handle guest customer actions for restricted POST requests
const handleGuestCustomerPostRequest = (req, isGuest) => {
    if (isGuest) {
        // Allow guest customers to add line items
        if (isLineItemEndpoint(req) || isStoreCartEndpoint(req)) {
            return;
        }
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, 'Guest customers are not allowed to perform this action.');
    }
};
// Refactored middleware function for checking guest customer status
//# sourceMappingURL=middlewares.js.map