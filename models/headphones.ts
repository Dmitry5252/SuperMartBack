import { InferSchemaType, Schema } from "mongoose";
import Item, { ItemType } from "./item";

const headphonesSchema = new Schema({
  type: String,
  interface: String,
  frequency: String,
  sensitivity: Number,
});

type Headphones = InferSchemaType<typeof headphonesSchema>;

type IHeadphones = Headphones & ItemType;

const Headphones = Item.discriminator<IHeadphones>("Headphones", headphonesSchema);

export default Headphones;
