import { Router, Application, Request, Response } from "express";
import bodyParser from "body-parser";
import { createGuestUser } from "../guest-cart/create-guest-user";
import { mergeCart } from "../guest-cart/merge-cart";

const route = Router();

const setupRoutes = (app: Application): Application => {
    app.use("/store", route);
    route.post("/guest-cart", createGuestUser);
    route.post("/guest-cart/merge-cart", mergeCart);
    return app;
};



export default setupRoutes;