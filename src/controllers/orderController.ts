import { Request, Response } from "express";
import { createOrderService, getAllOrderService } from "services/orderService";

type MiddleWareProps = {
  email: string;
};

export const createOrderController = async (
  req: Request & MiddleWareProps,
  res: Response
) => {
  try {
    const response = await createOrderService({
      email: req.email,
      ...req.body,
    });
    res.status(200).json({
      ...response,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};

export const getAllOrders = async (
  req: Request & MiddleWareProps,
  res: Response
) => {
  try {
    const response = await getAllOrderService(req.email);
    res.status(200).json({
      ...response,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: error,
    });
  }
};
