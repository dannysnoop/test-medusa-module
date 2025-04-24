import type { MiddlewaresConfig } from "@medusajs/medusa";
import { MedusaRequest, MedusaResponse, MedusaNextFunction, StorePostCartsCartReq } from '@medusajs/medusa';
export declare const checkGuestCustomer: (req: MedusaRequest<StorePostCartsCartReq>, res: MedusaResponse, next: MedusaNextFunction) => void;
export declare const config: MiddlewaresConfig;
