import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../utils/token";
import config from "../../config";
import AppError from "../../modules/errors/AppError";
import Doctor from "../../modules/Doctor/doctor.model";

export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.NOT_FOUND, " Token not found");
      }
      const verifiedUser = verifyToken(token, config.accessTokenSecret);
      if (roles.length && !roles.includes(verifiedUser?.role as string)) {
        throw new AppError(httpStatus.FORBIDDEN, "Unauthorized access");
      }

      req.user = verifiedUser;
      next();

      // console.log(verifiedUser);
    } catch (error) {
      next(error);
    }
  };
};

//! Test purpose
export const verifyDoctorAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const role = (req as any).user?.role;

    if (role !== "DOCTOR") {
      throw new AppError(httpStatus.FORBIDDEN, "Only doctors are allowed");
    }

    const doctor = await Doctor.findOne({ user: userId });

    if (!doctor) {
      throw new AppError(httpStatus.NOT_FOUND, "Doctor profile not found");
    }

    const subscription = doctor.subscription;
    const now = Date.now();

    const isTrialValid =
      subscription?.status === "trialing" &&
      subscription?.trialEnd &&
      new Date(subscription.trialEnd).getTime() > now;

    const isSubscriptionActive =
      subscription?.status === "active" &&
      subscription?.currentPeriodEnd &&
      new Date(subscription.currentPeriodEnd).getTime() > now;

    if (!isTrialValid && !isSubscriptionActive) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your subscription has expired. Please renew to access the dashboard."
      );
    }

    (req as any).doctor = doctor;
    next();
  } catch (err) {
    next(err);
  }
};
