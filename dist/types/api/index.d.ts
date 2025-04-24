import { Application } from "express";
interface Container {
}
declare const setupApi: (container: Container) => Application;
export default setupApi;
