import httpStatus from "http-status";
import { RequestHandler } from "express";
import sendResponse from "../../utils/SendResponse";
import { loginService, refreshTokenService } from "./auth.service";
import config from "../../config";

//? Login in controller
export const LoginController: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    const { refreshToken, accessToken, needPasswordChange } = result;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // 🔒 Prevents JS access to cookie
      secure: config.node_env === "production", // 🔒 Sends only over HTTPS in production
      sameSite: "strict", // 🛡️ Protects against CSRF
      //maxAge: 15 * 24 * 60 * 60 * 1000, // ⏳ 15 days in milliseconds
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " User logged in successfully",
      data: {
        accessToken,
        needPasswordChange,
      },
    });
  } catch (err) {
    next(err);
  }
};

//? access token generate
export const RefreshTokenGenerateController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { refreshToken } = req.cookies;
    const result = await refreshTokenService(refreshToken);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Token generate successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
