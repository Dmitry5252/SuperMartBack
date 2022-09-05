import { Request, Response } from "express";
import Item from "../models/item";

export const getImage = async (req: Request, res: Response) => {
  const imageIndex = Number(req.params.image);
  res.setHeader("Content-Type", "image/jpg");
  if (isNaN(imageIndex) || imageIndex < 0 || !Number.isInteger(imageIndex)) {
    return res.sendStatus(400);
  }
  try {
    const item = await Item.findOne({ model: req.params.name }).exec();
    if (!item) return res.sendStatus(404);

    const image = item.images[imageIndex];
    if (!image) return res.sendStatus(404);

    res.send(image);
  } catch (e) {
    res.sendStatus(500);
  }
};

export const getItem = (req: Request, res: Response) => {
  try {
    Item.findOne({ model: req.params.name }).exec((err, item) => {
      item ? res.send({ ...item.toObject(), images: item.images.length }) : res.sendStatus(404);
    });
  } catch (e) {
    res.sendStatus(500);
  }
};

type searchQuery = {
  __t?: string;
  $text?: { $search: string };
};

export const getItems = async (req: Request, res: Response) => {
  const searchQuery: searchQuery = {};

  if (req.params.category) searchQuery.__t = req.params.category;

  if (req.query.search) searchQuery.$text = { $search: req.query.search as string };

  const items = await Item.find(searchQuery).exec();

  try {
    res.send(items.map((item) => ({ ...item.toObject(), images: item.images.length })));
  } catch (e) {
    res.sendStatus(500);
  }
};
