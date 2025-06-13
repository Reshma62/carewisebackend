import httpStatus from "http-status";
import mongoose from "mongoose";
import { TErrorSrc, TGenericErrorResponse } from "./interface/error";

const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const statusCode = httpStatus.BAD_REQUEST;

  const errorSources: TErrorSrc = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
      path: val.path,
      message: val.message,
    })
  );

  return {
    statusCode,
    message: "Validation error",
    errorSources,
  };
};
export default handleValidationError;
