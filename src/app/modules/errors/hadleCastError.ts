import httpStatus from "http-status";
import mongoose from "mongoose";
import { TErrorSrc, TGenericErrorResponse } from "./interface/error";
const castErrorHandle = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const statusCode = httpStatus.BAD_REQUEST;

  const errorSources: TErrorSrc = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  return {
    statusCode,
    message: " Invalid id",
    errorSources,
  };
};

export default castErrorHandle;
