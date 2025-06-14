import httpStatus from "http-status";
import { RequestHandler } from "express";


import sendResponse from "../SendResponse";
import { handleCheckoutStripe, handleStripeWebhook } from "./stripe.service";

export const HandleCheckoutController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const data = req.body;

    const result = await handleCheckoutStripe(data);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " checkout url  ",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const WebhookController: RequestHandler = async (req, res, next) => {
  try {
    const result = await handleStripeWebhook(req);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Webhook received successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
