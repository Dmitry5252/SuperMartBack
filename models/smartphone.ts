import { InferSchemaType, Schema } from "mongoose";
import Item, { ItemType } from "./item";

const smartphoneSchema = new Schema({
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

type Smartphone = InferSchemaType<typeof smartphoneSchema>;

type ISmartphone = Smartphone & ItemType;

const Smartphone = Item.discriminator<ISmartphone>("Smartphone", smartphoneSchema);

export default Smartphone;
