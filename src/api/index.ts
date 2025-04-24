import express, { Application, Router } from "express";
import setupRoutes from "./routes";

interface Container {
    // Define the structure of the container object here
    // For example:
    // services: Record<string, unknown>;
}

const setupApi = (container: Container): Application => {
    const app = express();
    app.use(express.json());
    setupRoutes(app);
    return app;
};

export default setupApi;