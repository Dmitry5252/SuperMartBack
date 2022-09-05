import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema({
  name: {
    required: [true, "name is not provided"],
    type: String,
    validate: {
      validator: (v: string) => v.length >= 3,
      message: "length should be at least 3 symbols",
    },
  },
  email: {
    required: [true, "email not provided"],
    unique: true,
    type: String,
    trim: true,
    validate: {
      validator: (v: string) => /\S+@\S+\.\S+/.test(v),
      message: "{VALUE} is not a valid email!",
    },
  },
  password: {
    type: String,
    required: [true, "password not provided"],
  },
  cart: [
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
});

type User = InferSchemaType<typeof userSchema>;

export default model("User", userSchema);
