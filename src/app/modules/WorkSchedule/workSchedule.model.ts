import { Schema, model } from "mongoose";

const workPeriodSchema = new Schema(
  {
    startTime: {
      type: String, // e.g., "15:00"
      required: true,
    },
    endTime: {
      type: String, // e.g., "17:00"
      required: true,
    },
  },
  { _id: false }
);

const workScheduleSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    day: {
      type: Number, // eg., 0 for Sunday, 1 for Monday, etc.
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    workPeriods: {
      type: [workPeriodSchema], // Array of time periods
      default: [],
    },
  },
  { timestamps: true }
);

const WorkSchedule = model("WorkSchedule", workScheduleSchema);
export default WorkSchedule;
