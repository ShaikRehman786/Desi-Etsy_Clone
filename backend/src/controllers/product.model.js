

const Product = require('../models/product.model');

// PUBLIC (GET all approved products)
exports.getAll = async (_, res) => {
  try {
    const products = await Product.find({ isApproved: true }).populate('artisan', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

// PUBLIC (GET single approved product by ID)
exports.getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('artisan', 'name');
    if (!product || !product.isApproved)
      return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
};

// ARTISAN (CREATE product) - default isApproved to false
exports.create = async (req, res) => {
  try {
    const data = { ...req.body, artisan: req.user._id, isApproved: false };
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

// artisan get
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ artisan: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch artisan products' });
  }
};


// ARTISAN (UPDATE product owned by artisan)
exports.update = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, artisan: req.user._id },
      req.body,
      { new: true }
    );
    if (!product)
      return res.status(404).json({ message: 'Product not found or no permission' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

// ARTISAN (DELETE product owned by artisan)



exports.del = async (req, res) => {
  console.log("Deleting ID:", req.params.id); // ← Add this line

  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ADMIN (GET all pending approval products)
exports.adminListPending = async (_, res) => {
  try {
    const pending = await Product.find({ isApproved: false }).populate('artisan', 'name email');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending products', error: err.message });
  }
};

// ADMIN (APPROVE a product by ID)
exports.adminApprove = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!product)
      return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve product', error: err.message });
  }
};

// ADMIN (REJECT & DELETE a product by ID)
exports.adminReject = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product rejected and deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject product', error: err.message });
  }
};
