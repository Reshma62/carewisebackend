"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawBodyMiddleware = void 0;
const rawBodyMiddleware = (req, res, next) => {
    req.rawBody = "";
    req.on("data", (chunk) => {
        req.rawBody += chunk;
    });
    req.on("end", () => {
        next();
    });
};
exports.rawBodyMiddleware = rawBodyMiddleware;
