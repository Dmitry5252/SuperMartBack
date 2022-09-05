import { Router } from "express";
import {
  addItemToCart,
  changeItemInCart,
  getCart,
  removeItemFromCart,
  addOrder,
} from "../controllers/cart";
import authorizationMiddleware from "../middlewares/jwt";

const router = Router();

router.use(authorizationMiddleware);

router.post("/cart", addItemToCart);

router.put("/cart", changeItemInCart);

router.delete("/cart/:_id", removeItemFromCart);

router.get("/cart", getCart);

router.post("/order", addOrder);

export default router;
