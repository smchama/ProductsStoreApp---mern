import Product from "../models/product_model.js";
import mongoose from "mongoose";

// --- GET PRODUCTS (HANDLES SEARCH, CASE-INSENSITIVE CATEGORY, SORT, PAGINATION) ---
export const getProducts = async (req, res) => {
  try {
    // 1. Destructure query parameters with defaults
    const {
      page = 1,          // Current page number
      limit = 8,         // Items per page
      search = "",       // Search term for name
      category,          // Category filter
      sort = "newest"    // Sort option
    } = req.query;

    // 2. Build the dynamic query object
    const query = {};

    // Search: Filter by name (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Category: Filter by category (case-insensitive, ignores "all")
    if (category && category !== "all") {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    // 3. Define sort logic
    let sortOption = {};
    switch (sort) {
      case "price_low":
        sortOption = { price: 1 }; // Ascending
        break;
      case "price_high":
        sortOption = { price: -1 }; // Descending
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "newest":
      default:
        sortOption = { createdAt: -1 }; // Default
        break;
    }

    // 4. Calculate pagination values
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // 5. Execute the query with sort, skip, and limit
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    // 6. Get total count for frontend pagination component
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / pageSize);

    // 7. Send comprehensive response
    res.status(200).json({
      success: true,
      currentPage: pageNumber,
      totalPages,
      totalProducts,
      count: products.length, // Items on this page
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- CREATE PRODUCT (INCLUDES CATEGORY VALIDATION) ---
export const createProduct = async (req, res) => {
  const product = req.body;

  if (!product.name || !product.price || !product.image || !product.category) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields, including category" });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- UPDATE PRODUCT ---
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Product Id" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- DELETE PRODUCT ---
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Product Id" });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- GET SINGLE PRODUCT BY ID ---
export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Product Id" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};