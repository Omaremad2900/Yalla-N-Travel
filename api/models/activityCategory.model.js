import mongoose from "mongoose";

const activityCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Activity category name is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

const ActivityCategory = mongoose.model("ActivityCategory", activityCategorySchema);

export default ActivityCategory;