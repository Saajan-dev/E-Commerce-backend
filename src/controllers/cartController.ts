import { Request, Response } from "express";
import {
  cartListService,
  deleteCartService,
  updateCartService,
} from "services/cartService";
import { CartMiddlewareProps } from "types/cart";

const cartList = async (req: Request & CartMiddlewareProps, res: Response) => {
  try {
    const { page, size }: any = req.query;
    const cartListResponse = await cartListService({
      page,
      size,
      email: req.email,
    });
    res.status(200).json({
      ...cartListResponse,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};

const updateCart = async (
  req: Request & CartMiddlewareProps,
  res: Response
) => {
  try {
    const { product_id, is_cart, quantity, cart_id, actionType }: any =
      req.body;
    const updateCartResponse = await updateCartService({
      product_id,
      is_cart,
      quantity,
      cart_id,
      actionType,
      email: req.email,
    });
    res.status(200).json({
      ...updateCartResponse,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};

const deleteCart = async (
  req: Request & CartMiddlewareProps,
  res: Response
) => {
  try {
    const { cart_id, quantity }: any = req.query;
    const deleteCartResponse = await deleteCartService({
      cart_id,
      email: req.email,
      quantity,
    });
    res.status(200).json({
      ...deleteCartResponse,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};

export default {
  cartList,
  updateCart,
  deleteCart,
};
