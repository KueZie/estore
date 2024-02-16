import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import { Product } from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const cart = req.body;
  const { shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = cart;

  if (cart.orderItems && cart.orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  }
  const order = new Order({
    orderItems: cart.orderItems.map(item => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item._id
    })),
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  console.log('order:', order);

  const createdOrder = await order.save();

  res.status(201).json(createdOrder);
});

// @desc    Get all orders by user
// @route   GET /api/orders
// @access  Private - only users who placed the order can access or admin
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private - only users who placed the order can access or admin
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export { getOrders, addOrderItems, getUserOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered };
