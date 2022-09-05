import { InferSchemaType, Schema } from "mongoose";
import Item, { ItemType } from "./item";

const tabletSchema = new Schema({
  network: {
    GSM: Boolean,
    HSPA: Boolean,
    LTE: Boolean,
    "5G": Boolean,
  },
  body: {
    dimensions: {
      height: Number,
      width: Number,
      thickness: Number,
    },
    weight: Number,
    build: String,
  },
  display: {
    type: { type: String },
    size: Number,
    resolution: String,
  },
  cpu: {
    name: String,
    "number of cores": Number,
    "clock speed": String,
  },
  sim: Number,
  ram: Number,
  storage: Number,
  microsd: Boolean,
  camera: {
    front: Number,
    back: [Number],
  },
  accumulator: Number,
});

type Tablet = InferSchemaType<typeof tabletSchema>;

type ITablet = Tablet & ItemType;

const Tablet = Item.discriminator<ITablet>("Tablet", tabletSchema);

export default Tablet;
