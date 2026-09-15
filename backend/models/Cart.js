import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    unique: true, 
    required: true 
  },
  items: [{
    menuItem: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "MenuItem", 
      required: true 
    },
    quantity: { 
      type: Number, 
      min: 1, 
      default: 1 
    }
  }]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);