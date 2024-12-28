import { Router } from "express";
import { verifyTokens } from "middlewares/validations";
import cartController from "controllers/cartController";

const cartRouter = Router();

cartRouter.get("/cart-list", verifyTokens, cartController.cartList);

cartRouter.post("/update-cart", verifyTokens, cartController.updateCart);

cartRouter.delete("/delete-cart", verifyTokens, cartController.deleteCart);

export default cartRouter;
