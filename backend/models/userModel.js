import mongoose from "mongoose";

import bcrypt from "bcryptjs";
import Order from "./orderModel.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  }
},
  {
    timestamps: true
  });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Cascade delete orders when a user is deleted
userSchema.pre('deleteOne', { document: false, query: true }, async function() {
  const doc = await this.model.findOne(this.getFilter());
  await Order.deleteMany({ user: doc._id });
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;