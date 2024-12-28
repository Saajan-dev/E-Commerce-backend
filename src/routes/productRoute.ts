import { Router } from "express";
import { validate, verifyTokens } from "middlewares/validations";
import productController from "controllers/productController";
import { createProductSchema } from "middlewares/validations/productSchema";

const productRouter = Router();

productRouter.get("/products", verifyTokens, productController.productList);

productRouter.post(
  "/create-product",
  verifyTokens,
  validate(createProductSchema),
  productController.createproduct
);

productRouter.delete("/delete-product", productController.deleteProduct);

export default productRouter;
