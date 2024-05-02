import { Router } from "express";
// import { authorization, passportError } from "../utils/messageErrors.js";
import loggerControllers from "../controllers/logger.controller.js";

const loggerRouter = Router ();

loggerRouter.get('/', loggerControllers.getLog )

export default loggerRouter;