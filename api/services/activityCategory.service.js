import ActivityCategory from '../models/activityCategory.model.js';

export default class ActivityCategoryService {
  // Create an activity category
  async createCategory(data) {
    const category = new ActivityCategory(data);
    return await category.save();
  }

  // Get a category by ID
  async getCategoryById(id) {
    const category = await ActivityCategory.findById(id);
    return category;
  }

  // Get all categories
  async getAllCategories() {
    return await ActivityCategory.find({});
  }

  // Update an activity category by ID
  async updateCategory(id, data) {
    const category = await ActivityCategory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return category;
  }

  // Delete an activity category by ID
  async deleteCategory(id) {
    const category = await ActivityCategory.findByIdAndDelete(id);
    return category;
  }
}