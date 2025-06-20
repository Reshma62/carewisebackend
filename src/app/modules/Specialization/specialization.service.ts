import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { ISpecializationInput } from "./specialization.interface";
import Specialization from "./specialization.model";
export const insertIntoDbService = async (payload: ISpecializationInput) => {
  const existing = await Specialization.findOne({ name: payload.name });

  if (existing) {
    if (existing.isDeleted) {
      // If deleted, update and return the restored record
      existing.isDeleted = false;
      //   Object.assign(existing, payload); // update other fields if needed
      await existing.save();
      return existing;
    } else {
      throw new Error("Specialization with this name already exists.");
    }
  }

  // If not found, create new
  const result = await Specialization.create(payload);
  return result;
};

export const updateDbService = async (
  id: string,
  payload: ISpecializationInput
) => {
  // Find specialization by ID
  const specialization = await Specialization.findById(id);
  if (!specialization) {
    throw new Error("Specialization not found");
  }
  if (specialization.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot update a deleted specialization."
    );
  }
  // Check if another specialization with the same name exists in the same category (exclude current one)
  const duplicate = await Specialization.findOneAndUpdate({
    _id: { $ne: id }, // exclude current record
    name: payload.name,
    isDeleted: false,
  });

  if (duplicate) {
    throw new Error(
      "Another specialization with this name already exists in the same category."
    );
  }

  // Update the specialization
  const updatedData = await Specialization.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true } // return the updated document            );
  );

  return updatedData;
};
export const softDeleteService = async (id: string) => {
  const specialization = await Specialization.findById(id);
  if (!specialization) {
    throw new Error("Specialization not found");
  }

  // Mark as deleted
  specialization.isDeleted = true;
  await specialization.save();

  return specialization;
};
