// backend/controllers/order.controller.js
import Order from "../models/order.model.js";

// --- CREATE NEW ORDER ---
export const createOrder = async (req, res) => {
  const { fullName, address, city, paymentMethod, items, totalAmount } = req.body;

  if (!fullName || !address || !city || !paymentMethod || !items || items.length === 0 || !totalAmount) {
    return res.status(400).json({ success: false, message: "Please provide all required order details." });
  }

  try {
    // Safely extract the user ID regardless of how the token payload encodes it
    const userId = req.user._id || req.user.id || req.user.userId || req.user._doc?._id;

    if (!userId) {
      console.error("Auth Error: req.user object received is:", req.user);
      return res.status(401).json({ success: false, message: "Not authorized, user ID could not be determined from token." });
    }

    const newOrder = new Order({
      user: userId, // Attached by your 'protect' middleware
      fullName,
      address,
      city,
      paymentMethod,
      items,
      totalAmount,
      status: "Pending",
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// --- GET LOGGED-IN USER'S ORDERS (WITH LEGACY FALLBACK) ---
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId || req.user._doc?._id;
    
    // Fetch orders belonging to this user OR legacy orders with no user field
    const orders = await Order.find({
      $or: [
        { user: userId },
        { user: { $exists: false } },
        { user: null }
      ]
    }).sort({ createdAt: -1 });

    // Normalize so older orders without a status safely default to "Pending"
    const normalizedOrders = orders.map(order => ({
      ...order.toObject(),
      status: order.status || "Pending"
    }));
    
    res.status(200).json({ success: true, data: normalizedOrders });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- GET ALL ORDERS (ADMIN) ---
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email") // Optional: pulls user info if needed
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- UPDATE ORDER STATUS (ADMIN) ---
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body; // Expecting "Pending", "Processing", "Delivered", or "Cancelled"
  
  const validStatuses = ["Pending", "Processing", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value provided." });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};