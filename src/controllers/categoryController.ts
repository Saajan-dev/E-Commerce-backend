import { Request, Response } from "express";
import {
  categoryListService,
  createCategoryService,
  deleteCategoryService,
} from "services/categoryService";
import { CreateCategoryRequestParams } from "types/category";

type CreateCategoryMiddlewareProps = {
  email: string;
};

const categoryList = async (
  req: Request & CreateCategoryMiddlewareProps,
  res: Response
) => {
  try {
    const categoryListRes = await categoryListService(req.email);
    res.status(200).json({
      ...categoryListRes,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};

const createCategory = async (
  req: Request & CreateCategoryMiddlewareProps,
  res: Response
) => {
  try {
    console.log(req);
    
    const { name, image_url }: CreateCategoryRequestParams = req.body;
    const createResponse = await createCategoryService({
      name,
      image_url,
      email: req.email,
    });
    res.status(200).json({
      ...createResponse,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { category_id }: any = req.query;
    const deleteRes = await deleteCategoryService(category_id);
    console.log(deleteRes, "DSDS");

    res.status(200).json({
      ...deleteRes,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};

export default { categoryList, createCategory, deleteCategory };
