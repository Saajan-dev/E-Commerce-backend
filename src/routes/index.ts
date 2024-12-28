import { Router } from "express";
import authRouter from "./authRoute";
import categoryRouter from "./categoryRoute";
import productRouter from "./productRoute";
import wishlistRouter from "./wishlistRoute";
import cartRouter from "./cart";
import addressRouter from "./addressRoute";
import chatBotRouter from "./chatBotRoute";
import orderRouter from "./orderRoute";
const rootRouter = Router();

const rootRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/category",
    route: categoryRouter,
  },
  {
    path: "/product",
    route: productRouter,
  },
  {
    path: "/wishlist",
    route: wishlistRouter,
  },
  {
    path: "/cart",
    route: cartRouter,
  },
  {
    path: "/order",
    route: orderRouter,
  },
  {
    path: "/address",
    route: addressRouter,
  },
  {
    path: "/chatbot",
    route: chatBotRouter,
  },
];

rootRoutes.forEach((item) => rootRouter.use(item.path, item.route));

export default rootRouter;
