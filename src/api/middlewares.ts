import type {MiddlewaresConfig,} from "@medusajs/medusa"
import {
    MedusaRequest,
    MedusaResponse,
    MedusaNextFunction,
    MiddlewareRoute,
    StorePostCartsCartReq,
} from '@medusajs/medusa';

import { MedusaError } from '@medusajs/utils';
import jwt from 'jsonwebtoken';
import { JWTPayload } from 'jose';



export const checkGuestCustomer = (
    req: any,
    res: any,
    next: MedusaNextFunction,
): void => {
    try {
        const token = extractTokenFromHeader(req);

        if (req.baseUrl === '/store/guest-cart/merge-cart' && !token) {
            throw new MedusaError(
                MedusaError.Types.UNAUTHORIZED,
                'Authorization header is required for this endpoint.',
            );
        }

        // Proceed to next middleware if no token is found (or token is not relevant for guest-cart merge)
        if (!token) {
            next();
            return;
        }

        const decoded = jwt.decode(token) as JWTPayload;
        const isGuest = isGuestCustomer(decoded);

        // Block guest users from accessing restricted GET endpoint
        if (isGuest && isGuestAccessingRestrictedEndpoint(req)) {
            throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                'Access to this endpoint is not allowed.',
            );
        }

        // Handle POST requests for guest users
        if (isModifyingRequest(req)) {
            handleGuestCustomerPostRequest(req, isGuest);
            next();
            return;
        }

        // Proceed to next middleware if none of the conditions apply
        next();
    } catch (error) {
        next(error);
    }
};






export const config: MiddlewaresConfig = {
    routes: [
        {
            matcher: "",
            middlewares: [
                checkGuestCustomer
            ],
        },
    ],
}



const isGuestCustomer = (decoded: JWTPayload): boolean => decoded.is_guest as boolean;

const isGuestAccessingRestrictedEndpoint = (req: MedusaRequest<StorePostCartsCartReq>): boolean => {
    return req.method === 'GET' && req.baseUrl === '/store/customers/me';
};

const isModifyingRequest = (req: MedusaRequest<StorePostCartsCartReq>): boolean =>
    req.method === 'POST' ||
    req.method === 'DELETE' ||
    req.method === 'PUT' ||
    req.method === 'UPDATE';
const isLineItemEndpoint = (req: MedusaRequest<StorePostCartsCartReq>): boolean => {
    return /^\/store\/carts(\/[^/]+\/line-items(\/[^/]+)?)$/.test(req.baseUrl);
};

const isStoreCartEndpoint = (req: MedusaRequest<StorePostCartsCartReq>): boolean => {
    return /^\/store\/carts$/.test(req.baseUrl);
};

// Function to validate authorization header and extract token
const extractTokenFromHeader = (req: MedusaRequest<StorePostCartsCartReq>): string | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.split(' ')[1];
};

// Function to handle guest customer actions for restricted POST requests
const handleGuestCustomerPostRequest = (
    req: MedusaRequest<StorePostCartsCartReq>,
    isGuest: boolean,
): void => {
    if (isGuest) {
        // Allow guest customers to add line items
        if (isLineItemEndpoint(req) || isStoreCartEndpoint(req)) {
            return;
        }

        throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            'Guest customers are not allowed to perform this action.',
        );
    }
};

// Refactored middleware function for checking guest customer status

