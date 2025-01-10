const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Category = require('../models/Category');

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      vendor: req.user.id,
      stock
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit Product
exports.editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, description, stock, category } = req.body;

    const product = await Product.findOne({ _id: productId, vendor: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or you are not authorized' });
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    if (description) product.description = description;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Soft Delete Product
exports.deleteProduct = async (req, res) => {
    try {
      const { productId } = req.params;
  
      const product = await Product.findOne({ _id: productId, vendor: req.user.id });
      if (!product) {
        return res.status(404).json({ message: 'Product not found or you are not authorized' });
      }
  
      product.is_deleted = true;
      await product.save();
  
      res.status(200).json({ message: 'Product marked as deleted' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Get All Vendor Products
exports.getVendorProducts = async (req, res) => {
    try {
      const { search, category } = req.query;
      const query = { vendor: req.user.id, is_deleted: false };
  
      if (search) {
        query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
      }
  
      if (category) {
        query.category = category;
      }
  
      const products = await Product.find(query).populate('category').populate('vendor', 'username email');
      res.status(200).json(products);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Get Orders for Vendor's Products
exports.getVendorOrders = async (req, res) => {
    try {
      const { search, status } = req.query;
  
      const orders = await Order.find({
        'products.product': { $in: await Product.find({ vendor: req.user.id }).distinct('_id') },
        ...(status && { status }), // Filter by status if provided
      })
        .populate('buyer', 'username email') // Populate buyer details
        .populate('products.product', 'name price'); // Populate product details
  
      // Apply search to products' names (if specified)
      const filteredOrders = search
        ? orders.filter((order) =>
            order.products.some((p) => p.product.name.toLowerCase().includes(search.toLowerCase()))
          )
        : orders;
  
      res.status(200).json(filteredOrders);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
  
      const validStatuses = ['processed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      const order = await Order.findOne({
        _id: orderId,
        'products.product': { $in: await Product.find({ vendor: req.user.id }).distinct('_id') },
      });
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found or you are not authorized' });
      }
  
      order.status = status;
      await order.save();
  
      res.status(200).json(order);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.getCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
