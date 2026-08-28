// backend/controllers/order.controller.js
import Order from "../models/order.model.js";

// --- CREATE NEW ORDER ---
export const createOrder = async (req, res) => {
  const { fullName, address, city, paymentMethod, items, totalAmount } = req.body;

  if (!fullName || !address || !city || !paymentMethod || !items || items.length === 0 || !totalAmount) {
    return res.status(400).json({ success: false, message: "Please provide all required order details." });
  }

  try {
    const userId = req.user._id || req.user.id || req.user.userId || req.user._doc?._id;

    if (!userId) {
      console.error("Auth Error: req.user object received is:", req.user);
      return res.status(401).json({ success: false, message: "Not authorized, user ID could not be determined from token." });
    }

    const newOrder = new Order({
      user: userId,
      fullName,
      address,
      city,
      paymentMethod,
      items,
      totalAmount,
      status: "Pending",
      hiddenFromAdmin: false,
      hiddenFromUser: false,
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

// --- GET LOGGED-IN USER'S ORDERS ---
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId || req.user._doc?._id;
    
    // Fetch orders belonging to this user that are NOT hidden from user.
    // Cleanly removes the legacy fallback so brand new users start with 0 orders.
    const orders = await Order.find({
      user: userId,
      hiddenFromUser: { $ne: true }
    }).sort({ createdAt: -1 });

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
    // Fetch only orders that haven't been removed from the admin dashboard
    const orders = await Order.find({ hiddenFromAdmin: { $ne: true } })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- UPDATE ORDER STATUS (ADMIN) ---
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  
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

// --- REMOVE ORDER FROM ADMIN VIEW (ADMIN) ---
export const adminDeleteOrder = async (req, res) => {
  try {
    // Use findByIdAndUpdate to toggle the flag directly without triggering full document Mongoose validation
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { hiddenFromAdmin: true },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // If both admin and user have hidden it, perform a hard delete to clean up the DB
    if (order.hiddenFromUser) {
      await Order.findByIdAndDelete(req.params.id);
    }

    res.status(200).json({
      success: true,
      message: "Order removed from admin dashboard successfully.",
    });
  } catch (error) {
    console.error("Error removing order for admin:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};