import { RequestHandler } from "express";
import sendResponse from "../../utils/SendResponse";
import httpStatus from "http-status";
import { insertIntoDbService, loginService } from "./user.service";

export const CreateController: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await insertIntoDbService(data);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " User created successfully ",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// User login

export const LoginController: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await loginService(email);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " User logged in successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};


