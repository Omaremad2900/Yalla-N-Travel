import PreferenceTag from '../models/preferenceTag.model.js';
import ApiError from '../utils/apiError.js';
import { StatusCodes } from 'http-status-codes';

class PreferenceTagService {
  async createTag(name) {
    const existingTag = await PreferenceTag.findOne({ name });
    if (existingTag) {
      throw new ApiError("Preference tag already exists", StatusCodes.CONFLICT);
    }

    const newTag = new PreferenceTag({ name });
    await newTag.save();
    return newTag;
  }

  async getAllTags() {
    return await PreferenceTag.find();
  }

  async updateTag(id, name) {
    const tag = await PreferenceTag.findByIdAndUpdate(id, { name }, { new: true });
    if (!tag) {
      throw new ApiError("Preference tag not found", StatusCodes.NOT_FOUND);
    }
    return tag;
  }

  async deleteTag(id) {
    const tag = await PreferenceTag.findByIdAndDelete(id);
    if (!tag) {
      throw new ApiError("Preference tag not found", StatusCodes.NOT_FOUND);
    }
    return { message: "Preference tag deleted successfully" };
  }
}

export default PreferenceTagService;