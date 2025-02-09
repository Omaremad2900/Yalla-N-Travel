import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError.js';

// Controller method to create a Tag
export const createTagController = async (req, res, next) => {
  try {
    const tagService = req.container.resolve('tagService');
    const tag = await tagService.createTag(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};

export const findOrCreateTagController = async (req, res, next) => {
  const { name, type } = req.body;
  console.log(name +"  " + type)

  try {
      const tagService = req.container.resolve('tagService');
      const tagId = await tagService.findOrCreateTag(name, type);
      res.status(StatusCodes.OK).json({ success: true, data: { tagId } });
  } catch (error) {
      next(error);
  }
};

export const getAllTagsController = async(req, res, next) =>{
    try{
      const tagService = req.container.resolve('tagService');
      const tags = await tagService.getAllTags();
      res.status(StatusCodes.OK).json({
        success: true,
        data: tags
      });
    } catch (error) {
      next(error);
    }
  };