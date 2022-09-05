import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";
import { Request, Response } from "express";
import { Error } from "mongoose";

export const register = async (req: Request, res: Response) => {
  const oldUser = await User.findOne({ email: req.body.email }).exec();

  if (oldUser) return res.status(401).send("Email already used");

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  try {
    await user.save();
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return res.sendStatus(400);
    } else {
      return res.sendStatus(500);
    }
  }
  const token = jwt.sign({ id: user.id }, process.env.API_SECRET as string, {
    expiresIn: 86400,
  });

  res.cookie("Authorization", `Bearer ${token}`, { httpOnly: true, maxAge: 86400 * 1000 });

  res.status(200).send({
    user: { id: user._id, email: user.email, password: user.password },
    message: "User registered successfully",
  });
};

export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email }).exec();

  if (!user) {
    return res.status(400).send({ message: "Invalid email or password" });
  }

  const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordIsValid) {
    return res.status(400).send({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user.id }, process.env.API_SECRET as string, {
    expiresIn: 86400,
  });

  res.cookie("Authorization", `Bearer ${token}`, { httpOnly: true, maxAge: 86400 * 1000 });

  res.status(200).send({
    user: { id: user._id, email: user.email, password: user.password },
    message: "Login Successfull",
  });
};
