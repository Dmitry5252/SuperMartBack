import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
dotenv.config();

import authRouter from "./routes/auth";
import itemRouter from "./routes/item";
import cartRouter from "./routes/cart";

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(authRouter);

app.use(itemRouter);

app.use(cartRouter);

try {
  mongoose.connect(process.env.MONGO_URI as string);
  console.log("connected to db");
} catch (error) {
  console.log(error);
}

app.listen(process.env.PORT);
