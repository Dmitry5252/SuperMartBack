import { InferSchemaType, Schema } from "mongoose";
import Item, { ItemType } from "./item";

const consoleSchema = new Schema({
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
});

type Console = InferSchemaType<typeof consoleSchema>;

type IConsole = Console & ItemType;

const Console = Item.discriminator<IConsole>("Console", consoleSchema);

export default Console;
