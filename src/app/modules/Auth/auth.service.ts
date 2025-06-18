import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

import httpStatus from "http-status";
import User from "../User/user.model";
import AppError from "../errors/AppError";
import { generateToken, verifyToken } from "../../utils/token";
import config from "../../config";
import Doctor from "../Doctor/doctor.model";
import { IUser } from "../User/user.interface";
import Patient from "../Patient/patient.model";
import moment from "moment";

//Login
export const loginService = async (email: string, password: string) => {
  // 1. Find user by email and include password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User Deleted");
  }

  // 2. Compare passwords
  const isPasswordMatched: boolean = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credential");
  }

  const userPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(userPayload, "access");
  const refreshToken = generateToken(userPayload, "refresh");

  // 3. Check dashboard access for doctors
  let canAccessDashboard = true;

  if (user.role === "DOCTOR") {
    const doctor = await Doctor.findOne({ user: user._id });

    if (!doctor) {
      canAccessDashboard = false;
    } else {
      const subscription = doctor.subscription;

      const isTrialValid =
        subscription?.status === "trialing" &&
        subscription?.trialEnd &&
        new Date(subscription.trialEnd).getTime() > Date.now();

      const isSubscriptionActive = subscription?.status === "active";

      canAccessDashboard = isTrialValid || isSubscriptionActive;
    }
  }

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
    role: user.role,
    canAccessDashboard,
  };
};

//? Get me data
export const getMeService = async (payload: JwtPayload) => {
  const getUser = await User.findById(payload.id);
  if (!getUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const responseData: any = {
    role: getUser.role,
  };

  if (getUser.role === "DOCTOR") {
    const doctorData = await Doctor.findOne({ user: getUser._id }).populate(
      "user",
      "email role"
    );
    if (!doctorData) {
      throw new AppError(httpStatus.NOT_FOUND, "Doctor profile not found");
    }

    const subscription = doctorData.subscription;
    const now = new Date().getTime();

    const isTrialValid =
      subscription?.status === "trialing" &&
      subscription?.trialEnd &&
      new Date(subscription.trialEnd).getTime() > now;

    const isSubscriptionActive =
      subscription?.status === "active" &&
      subscription?.currentPeriodEnd &&
      new Date(subscription.currentPeriodEnd).getTime() > now;

    const canAccessDashboard = isTrialValid || isSubscriptionActive;

    // Calculate remaining subscription time
    let remainingSubscriptionTime = "Expired";
    if (isTrialValid && subscription?.trialEnd) {
      const endDate = moment(subscription.trialEnd);
      const nowMoment = moment();
      const daysRemaining = endDate.diff(nowMoment, "days");

      if (daysRemaining >= 30) {
        const months = Math.floor(daysRemaining / 30);
        const remainingDays = daysRemaining % 30;
        remainingSubscriptionTime = `${months} month${months > 1 ? "s" : ""}${
          remainingDays > 0
            ? `, ${remainingDays} day${remainingDays > 1 ? "s" : ""}`
            : ""
        }`;
      } else if (daysRemaining > 0) {
        remainingSubscriptionTime = `${daysRemaining} day${
          daysRemaining > 1 ? "s" : ""
        }`;
      }
    } else if (isSubscriptionActive && subscription?.currentPeriodEnd) {
      const endDate = moment(subscription.currentPeriodEnd);
      const nowMoment = moment();
      const daysRemaining = endDate.diff(nowMoment, "days");

      if (daysRemaining >= 30) {
        const months = Math.floor(daysRemaining / 30);
        const remainingDays = daysRemaining % 30;
        remainingSubscriptionTime = `${months} month${months > 1 ? "s" : ""}${
          remainingDays > 0
            ? `, ${remainingDays} day${remainingDays > 1 ? "s" : ""}`
            : ""
        }`;
      } else if (daysRemaining > 0) {
        remainingSubscriptionTime = `${daysRemaining} day${
          daysRemaining > 1 ? "s" : ""
        }`;
      }
    }

    responseData.user = doctorData;
    responseData.canAccessDashboard = canAccessDashboard;
    responseData.remainingSubscriptionTime = remainingSubscriptionTime;
  } else if (getUser.role === "PATIENT") {
    const patientData = await Patient.findOne({ user: getUser._id }).populate(
      "user",
      "email role"
    );
    if (!patientData) {
      throw new AppError(httpStatus.NOT_FOUND, "Patient profile not found");
    }

    responseData.user = patientData;
  } else {
    responseData.user = getUser; // Fallback for other roles (e.g., ADMIN)
  }

  return responseData;
};

// Refresh token
export const refreshTokenService = async (token: string) => {
  try {
    const decoded = verifyToken(token, config.refreshTokenSecret);

    const isUserExits = await User.findOne({
      email: decoded?.email,
      isDeleted: false,
    });
    if (!isUserExits) {
      throw new AppError(httpStatus.FORBIDDEN, "User Not found");
    }

    const newAccessToken = generateToken(
      {
        id: isUserExits?._id.toString(),
        email: isUserExits?.email,
        role: isUserExits?.role,
      },
      "access"
    );

    return { accessToken: newAccessToken };
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Refresh Token");
  }
};
