import { RequestHandler } from "express";
import sendResponse from "../../utils/SendResponse";
import httpStatus from "http-status";
import { insertIntoDbService } from "./user.service";

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




