// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true // Good practice to trim whitespace
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    // --- NEW FIELD ADDED HERE ---
    category: {
      type: String,
      required: [true, "Please select a category for the product"],
      trim: true,
      // Optional: Restrict to specific values. Feel free to adjust this list.
      //enum: ["Electronics", "Clothing", "Footwear", "Home Goods", "Groceries","Cosmetics", "Watches","Accessories"]
    }
    // ----------------------------
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;