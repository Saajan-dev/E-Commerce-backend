import { Request, Response } from "express";
import productService from "services/productService";
import logger from "utils/logger";

type createProductMiddlewareProps = {
  email: string;
};

const productList = async (
  req: Request & createProductMiddlewareProps,
  res: Response
) => {
  try {
    const { page, size, product_id }: any = req.query;

    const listResponse = await productService.productListService({
      page,
      size,
      product_id,
      email: req.email,
    });

    res.status(200).json({
      ...listResponse,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};

const createproduct = async (
  req: Request & createProductMiddlewareProps,
  res: Response
) => {
  try {
    const response = await productService.createProductService({
      ...req.body,
      email: req.email,
    });
    logger.info(response.message);
    res.status(200).json({
      ...response,
    });
  } catch (error) {
    logger.error(error);
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { product_id }: any = req.query;
    const deleteRes = await productService.deleteProductService(product_id);
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

export default {
  createproduct,
  productList,
  deleteProduct,
};
