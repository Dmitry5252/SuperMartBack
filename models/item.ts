import { Schema, model, InferSchemaType } from "mongoose";

const itemSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  brand: {
    required: true,
    type: String,
  },
  model: {
    required: true,
    type: String,
  },
  images: { type: [Buffer] },
  price: { required: true, type: Number },
  __t: String,
});

export type ItemType = InferSchemaType<typeof itemSchema>;

export default model("Item", itemSchema);
