import { Router } from "express";
import { validate, verifyTokens } from "middlewares/validations";
import wishlistController from "controllers/wishlistController";
import * as wishlistSchema from "middlewares/validations/wishlistSchema";
const wishlistRouter = Router();

wishlistRouter.get("/get-list", verifyTokens, wishlistController.wishlist);

wishlistRouter.post(
  "/update-wishlist",
  verifyTokens,
  validate(wishlistSchema.updateWishlistSchema),
  wishlistController.updateWishlist
);

export default wishlistRouter;
