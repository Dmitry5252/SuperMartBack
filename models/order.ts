import { Schema, model, InferSchemaType } from "mongoose";

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  shipping: {
    type: String,
    enum: { values: ["free", "express"], message: `shipping can be "free" or "express"` },
    required: [true, "shipping not provided"],
  },
  adress: {
    type: String,
    required: [true, "adress not provided"],
    minLength: [3, "adress length cannot be less than 3"],
  },
  items: {
    type: [
      {
        item: { type: Schema.Types.ObjectId, ref: "Item" },
        count: {
          type: Number,
          default: 0,
          required: [true, "count not provided"],
          min: [1, "count cannot be less than 1"],
        },
      },
    ],
    validate: [
      (
        items: [
          {
            item: { type: Schema.Types.ObjectId; ref: "Item" };
            count: {
              type: Number;
              default: 0;
              required: [true, "count not provided"];
              min: [1, "count cannot be less than 1"];
            };
          }
        ]
      ) => items.length >= 1,
      "order should have at least 1 item",
    ],
  },
});

type Order = InferSchemaType<typeof orderSchema>;

export default model("Order", orderSchema);
