import {
  createOrderController,
  getAllOrders,
} from "controllers/orderController";
import { Router } from "express";
import { verifyTokens } from "middlewares/validations";

const orderRouter = Router();

orderRouter.post("/", verifyTokens, createOrderController);
orderRouter.get("/get-all-order", verifyTokens, getAllOrders);

export default orderRouter;
