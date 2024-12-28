import { Request, Response } from "express";
import {
  updateWishlistService,
  wishlistService,
} from "services/wishlistService";

type WishlistMiddlewareParams = {
  email: string;
};

const wishlist = async (
  req: Request & WishlistMiddlewareParams,
  res: Response
) => {
  try {
    const { page, size }: any = req.query;
    const listResponse = await wishlistService({
      page,
      size,
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

const updateWishlist = async (
  req: Request & WishlistMiddlewareParams,
  res: Response
) => {
  try {
    const { product_id, is_wishlist, wishlist_id }: any = req.body;
    const updateResponse = await updateWishlistService({
      product_id,
      is_wishlist,
      wishlist_id,
      email: req.email,
    });
    res.status(200).json({
      ...updateResponse,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};

export default {
  wishlist,
  updateWishlist,
};
