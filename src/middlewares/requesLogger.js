import { logger } from "../utils/logger.js";

export function requestLogger (req, res, next) {
    logger.info(`Request ${req.method} - ${req.url} - Date: ${new Date().toLocaleString()}`);
    next();
}