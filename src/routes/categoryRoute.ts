import categoryController from "controllers/categoryController";
import { Router } from "express";
import { validate, verifyTokens } from "middlewares/validations";
import * as categorySchema from "middlewares/validations/categorySchema";

const categoryRouter = Router();

categoryRouter.get(
  "/category-list",
  verifyTokens,
  categoryController.categoryList
);

categoryRouter.post(
  "/create-category",
  verifyTokens,
  validate(categorySchema.createCategorySchema),
  categoryController.createCategory
);

categoryRouter.delete("/delete-category", categoryController.deleteCategory);

export default categoryRouter;
