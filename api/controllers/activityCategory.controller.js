import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError.js';

// Create an activity category
export const createActivityCategoryController = async (req, res, next) => {
  try {
    const activityCategoryService = req.container.resolve('activityCategoryService');
    const category = await activityCategoryService.createCategory(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: category });
  } catch (error) {
    next(new ApiError('Error creating activity category', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

// Get an activity category by ID
export const getActivityCategoryController = async (req, res, next) => {
  try {
    const activityCategoryService = req.container.resolve('activityCategoryService');
    const category = await activityCategoryService.getCategoryById(req.params.id);
    if (!category) {
      return next(new ApiError('Activity category not found', StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({ success: true, data: category });
  } catch (error) {
    next(new ApiError('Error fetching activity category', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

// Get all activity categories
// activityCategory.controller.js
export const getAllActivityCategoriesController = async (req, res, next) => {
  try {
    const activityCategoryService = req.container.resolve('activityCategoryService');
    const categories = await activityCategoryService.getAllCategories();
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(new ApiError('Error fetching activity categories', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};


// Update an activity category by ID
export const updateActivityCategoryController = async (req, res, next) => {
  try {
    const activityCategoryService = req.container.resolve('activityCategoryService');
    const category = await activityCategoryService.updateCategory(req.params.id, req.body);
    if (!category) {
      return next(new ApiError('Activity category not found', StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({ success: true, data: category });
  } catch (error) {
    next(new ApiError('Error updating activity category', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

// Delete an activity category by ID
export const deleteActivityCategoryController = async (req, res, next) => {
  try {
    const activityCategoryService = req.container.resolve('activityCategoryService');
    const category = await activityCategoryService.deleteCategory(req.params.id);
    if (!category) {
      return next(new ApiError('Activity category not found', StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(new ApiError('Error deleting activity category', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

