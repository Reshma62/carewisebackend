import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

import httpStatus from "http-status";
import User from "../User/user.model";
import AppError from "../errors/AppError";
import { generateToken } from "../../utils/token";
import config from "../../config";

export const loginService = async (email: string, password: string) => {
  // 1. Find user by email and include password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // check if the user is deleted or not

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
    id: user?._id.toString(),
    email: user?.email,
    role: user?.role,
  };
  const accessToken = generateToken(userPayload, "access");
  const refreshToken = generateToken(userPayload, "refresh");

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  }; // Password matched, return user data
};

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const refreshTokenService = async (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      config.refreshTokenSecret
    ) as DecodedToken;

    const isUserExits = await User.findOne({ email: decoded?.email });

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
