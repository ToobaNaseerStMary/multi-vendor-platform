const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy } = req.query;

    const query = { is_deleted: false };

    // Apply search filter
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive
    }

    // Apply category filter
    if (category) {
      query.category = category;
    }

    // Apply price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Sorting
    const sortOptions = {};
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    }

    // Fetch products with filters
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('vendor', 'username email')
      .sort(sortOptions);

    // Group products by category
    const groupedProducts = products.reduce((group, product) => {
      const categoryName = product.category?.name || "Uncategorized";
      if (!group[categoryName]) {
        group[categoryName] = [];
      }
      group[categoryName].push(product);
      return group;
    }, {});

    res.status(200).json({
      totalProducts: products.length,
      data: groupedProducts,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.placeOrder = async (req, res) => {
  try {
    const { products } = req.body; // Array of { productId, quantity }

    // Fetch products and validate they are from the same vendor
    const productIds = products.map((p) => p.productId);
    const fetchedProducts = await Product.find({ _id: { $in: productIds } });

    if (!fetchedProducts.length) {
      return res.status(400).json({ message: 'No valid products found in the order' });
    }

    const vendorIds = new Set(fetchedProducts.map((p) => p.vendor.toString()));
    if (vendorIds.size > 1) {
      return res.status(400).json({ message: 'You can only order products from a single vendor' });
    }

    // Validate stock availability
    for (const item of products) {
      const product = fetchedProducts.find((p) => p._id.toString() === item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    // Calculate total price
    const totalPrice = products.reduce((total, item) => {
      const product = fetchedProducts.find((p) => p._id.toString() === item.productId);
      return total + product.price * item.quantity;
    }, 0);

    // Decrease stock count
    for (const item of products) {
      const product = fetchedProducts.find((p) => p._id.toString() === item.productId);
      product.stock -= item.quantity;
      await product.save(); // Update product stock
    }

    // Create order
    const order = new Order({
      buyer: req.user.id,
      products: products.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      })),
      totalPrice,
      status: 'confirmed',
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

  exports.getOrderHistory = async (req, res) => {
    try {
      const orders = await Order.find({ buyer: req.user.id })
        .populate('products.product', 'name price')
        .populate('buyer', 'username email');
  
      res.status(200).json(orders);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      const order = await Order.findOne({ _id: orderId, buyer: req.user.id });
      if (!order) {
        return res.status(404).json({ message: 'Order not found or you are not authorized' });
      }
  
      if (['processed', 'shipped', 'delivered'].includes(order.status)) {
        return res.status(400).json({ message: 'Order cannot be canceled at this stage' });
      }
  
      order.status = 'cancelled';
      await order.save();
  
      res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  