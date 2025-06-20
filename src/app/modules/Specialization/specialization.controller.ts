import httpStatus from "http-status";
import { RequestHandler } from "express";
import sendResponse from "../../utils/SendResponse";
import {
  getAllSpecializations,
  getSpecializationById,
  insertIntoDbService,
  softDeleteService,
  updateDbService,
} from "./specialization.service";

export const InsertIntoDbController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const data = req.body;
    const result = await insertIntoDbService(data);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Specialization created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
export const UpdateSpecializationController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const data = req.body;
    const { id } = req.params; // Assuming the ID is passed as a URL parameter
    const result = await updateDbService(id, data);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Specialization updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const SoftDeletedController: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await softDeleteService(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " Specialization deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const GetSpecializationByIdController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const result = await getSpecializationById(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Specialization retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const GetAllSpecializationsController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    // Assuming you have a service to get all specializations
    const result = await getAllSpecializations();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All specializations retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};