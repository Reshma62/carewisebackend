import httpStatus from "http-status";
import { ZodError } from "zod";
import { TErrorSrc, TGenericErrorResponse } from "./interface/error";

const zodErrorHandle = (err: ZodError): TGenericErrorResponse => {
  const statusCode = httpStatus.BAD_REQUEST;

  const errorSources: TErrorSrc = err.issues.map((issue) => ({
    path: issue.path[issue.path.length - 1] as string | number,
    message: issue.message,
  }));

  return {
    statusCode,
    message: " Validation error",
    errorSources,
  };
};

export default zodErrorHandle;
