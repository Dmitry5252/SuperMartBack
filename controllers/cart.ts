import { Response } from "express";
import { Req } from "../middlewares/jwt";
import User from "../models/user";
import Order from "../models/order";

import Item, { ItemType } from "../models/item";
import { Error } from "mongoose";

interface ICartItem {
  item: ItemType;
  count: number;
}

const clientCartItem = (CartItem: ICartItem) => ({
  count: CartItem.count,
  item: {
    _id: CartItem.item._id,
    brand: CartItem.item.brand,
    model: CartItem.item.model,
    price: CartItem.item.price,
    category: CartItem.item.__t,
  },
});

export const addItemToCart = async (req: Req, res: Response) => {
  const user = await User.findById(req.id, "cart")
    .populate<{ cart: ICartItem[] }>("cart.item")
    .exec();
  const item = await Item.findById(req.body._id).exec();

  if (!item) {
    return res.sendStatus(400);
  }

  if (!user) {
    return res.sendStatus(401);
  }

  if (req.body.count <= 0 || !Number.isSafeInteger(req.body.count)) {
    return res.sendStatus(400);
  }

  let cartItem = user.cart.find((e) => e.item && e.item._id == req.body._id);

  if (cartItem) {
    cartItem.count += req.body.count;
  } else {
    cartItem = { item, count: req.body.count };
    user.cart.push(cartItem);
  }
  try {
    await user.save();
  } catch (e) {
    return res.sendStatus(400);
  }
  res.json(clientCartItem(cartItem));
};

export const changeItemInCart = async (req: Req, res: Response) => {
  const user = await User.findById(req.id, "cart")
    .populate<{ cart: ICartItem[] }>("cart.item")
    .exec();

  if (!user) {
    return res.sendStatus(401);
  }

  if (req.body.count <= 0 || !Number.isSafeInteger(req.body.count)) {
    return res.sendStatus(400);
  }

  const cartItem = user.cart.find((e) => e.item && e.item._id == req.body._id);

  if (cartItem) {
    cartItem.count = req.body.count;
  } else {
    return res.sendStatus(404);
  }
  try {
    await user.save();
  } catch (e) {
    return res.sendStatus(400);
  }
  res.json(clientCartItem(cartItem));
};

export const removeItemFromCart = async (req: Req, res: Response) => {
  const user = await User.findById(req.id, "cart").exec();

  if (!user) {
    return res.sendStatus(401);
  }

  const cartItemIndex = user.cart.findIndex(
    (e) => e.item && e.item._id.toString() == req.params._id
  );

  if (cartItemIndex != -1) {
    user.cart.splice(cartItemIndex, 1);
    user.save();
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

export const getCart = async (req: Req, res: Response) => {
  const user = await User.findById(req.id, "cart")
    .populate<{ cart: ICartItem[] }>("cart.item")
    .exec();

  if (!user) {
    return res.sendStatus(401);
  }

  const cart = user.toObject<{ cart: ICartItem[] }>().cart;

  res.json(cart.map((e) => clientCartItem(e)));
};

export const addOrder = async (req: Req, res: Response) => {
  const user = await User.findById(req.id, "cart");

  if (!user) {
    return res.sendStatus(401);
  }

  try {
    const order = new Order({
      user: user,
      items: user.cart,
      shipping: req.body.shipping,
      adress: req.body.adress,
    });
    await order.save();
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      return res.sendStatus(400);
    } else {
      return res.sendStatus(500);
    }
  }

  user.cart = [];

  user.save();

  res.sendStatus(200);
};
