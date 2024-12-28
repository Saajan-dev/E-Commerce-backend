import { Router } from "express";
import { verifyTokens } from "middlewares/validations";

const addressRouter = Router();

addressRouter.get("/address-list", verifyTokens);

addressRouter.post("/create-address", verifyTokens);

addressRouter.put("/update-address", verifyTokens);

addressRouter.delete("/delete-address", verifyTokens);

export default addressRouter;
