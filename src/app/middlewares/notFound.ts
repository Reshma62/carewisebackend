import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API Not Found",
    path: req.originalUrl,
  });
};

export default notFoundHandler;
