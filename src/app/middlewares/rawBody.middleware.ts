import { Request, Response, NextFunction } from "express";

interface RawBodyRequest extends Request {
  rawBody?: string;
}

export const rawBodyMiddleware = (
  req: RawBodyRequest,
  res: Response,
  next: NextFunction
) => {
  req.rawBody = "";

  req.on("data", (chunk) => {
    req.rawBody += chunk;
  });

  req.on("end", () => {
    next();
  });
};
