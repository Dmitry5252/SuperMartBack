import { Router } from "express";
import { getImage, getItem, getItems } from "../controllers/item";

const router = Router();

router.get("/item/:name/:image", getImage);

router.get("/item/:name", getItem);

router.get("/items/:category?", getItems);

export default router;
