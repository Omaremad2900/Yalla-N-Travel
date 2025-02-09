import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";

export const createPreferenceTag = async (req, res, next) => {
  const { name } = req.body;
  try {
    const preferenceTagService = await req.container.resolve('preferenceTagService');
    const tag = await preferenceTagService.createTag(name);
    res.status(StatusCodes.CREATED).json({ success: true, tag });
  } catch (error) {
    next(error);
  }
};

export const getAllPreferenceTags = async (req, res, next) => {
  try {
    const preferenceTagService = await req.container.resolve('preferenceTagService');
    const tags = await preferenceTagService.getAllTags();
    res.status(StatusCodes.OK).json({ success: true, tags });
  } catch (error) {
    next(error);
  }
};

export const updatePreferenceTag = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const preferenceTagService = await req.container.resolve('preferenceTagService');
    const updatedTag = await preferenceTagService.updateTag(id, name);
    res.status(StatusCodes.OK).json({ success: true, updatedTag });
  } catch (error) {
    next(error);
  }
};

export const deletePreferenceTag = async (req, res, next) => {
  const { id } = req.params;
  try {
    const preferenceTagService = await req.container.resolve('preferenceTagService');
    const result = await preferenceTagService.deleteTag(id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};