import httpStatus from "http-status";
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { errorSources, TErrorSrc } from "../modules/errors/interface/error";
import config from "../config";
import zodErrorHandle from "../modules/errors/zodErrorHandler";
import handleValidationError from "../modules/errors/handleValidationError";
import castErrorHandle from "../modules/errors/hadleCastError";
import handleDuplicateError from "../modules/errors/handleDuplicateError";
import AppError from "../modules/errors/AppError";

// type TErrorSrc = {
//   path: string | number;
//   message: string;
// }[];
// let errorSources: TErrorSrc = [
//   {
//     path: "",
//     message: "something went wrong",
//   },
// ];
const globalErrorHandle: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "something went wrong";
  let errorSources: TErrorSrc = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = zodErrorHandle(err);
    message = simplifiedError?.message || "something went wrong";
    statusCode = simplifiedError?.statusCode;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    message = simplifiedError?.message || "something went wrong";
    statusCode = simplifiedError?.statusCode;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "CastError") {
    const simplifiedError = castErrorHandle(err);
    message = simplifiedError?.message || "something went wrong";
    statusCode = simplifiedError?.statusCode;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  //default ultimate  response

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === "development" ? err.stack : null,
  });
};

export default globalErrorHandle;
