import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true, // Unique constraint automatically creates an index
    required: [true, "Username is required"],
    trim: true,
  },
  email: {
    type: String,
    unique: true, // Unique constraint automatically creates an index
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  profileImagePath: {
    type: String,
    required: [true, "Profile image is required"],
  },
  wishlist: {
    type: Array,
    default: [],
  },
  cart: {
    type: Array,
    default: [],
  },
  orders: {
    type: Array,
    default: [],
  },
  works: {
    type: Array,
    default: [],
  },
  role: { 
    type: String, 
    default: "user",
    enum: ["user", "admin"], 
  },
});

const User = models.User || model("User", UserSchema);

export default User;
