import { Schema, InferSchemaType } from "mongoose";
import Item, { ItemType } from "./item";

const laptopSchema = new Schema({
  screen: {
    "screen diagonal": Number,
    "matrix type": String,
    resolution: String,
    "refresh rate": Number,
  },
  cpu: {
    name: String,
    "number of cores": Number,
    "clock speed": String,
  },
  ram: {
    capacity: Number,
    speed: Number,
    type: { type: String },
  },
  storage: [{ type: { type: String }, capacity: Number }],
  gpu: { name: String, memory: Number },
  weight: Number,
  color: String,
});

type Laptop = InferSchemaType<typeof laptopSchema>;

type ILaptop = Laptop & ItemType;

const Laptop = Item.discriminator<ILaptop>("Laptop", laptopSchema);

export default Laptop;
