import { Router, Application, Request, Response } from "express";
import bodyParser from "body-parser";
import { createGuestUser } from "../guest-cart/create-guest-user";
import { mergeCart } from "../guest-cart/merge-cart";
import {checkGuestCustomer} from "../middlewares";

const route = Router();

const setupRoutes = (app: Application): Application => {
    app.use("/store", route);
    route.post("/guest-cart",checkGuestCustomer, createGuestUser);
    route.post("/guest-cart/merge-cart",checkGuestCustomer, mergeCart);
    return app;
};



export default setupRoutes;