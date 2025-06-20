const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    // 🔒 Approval check
    if (req.user.role === 'Customer' && !req.user.isApproved) {
      return res.status(403).json({ message: "Account not approved by admin" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    return res.status(200).json({ message: "Added to cart", cart });
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get cart items for logged-in user
exports.getCart = async (req, res) => {
  try {
    // 🔒 Approval check
    if (req.user.role === 'Customer' && !req.user.isApproved) {
      return res.status(403).json({ message: "Account not approved by admin" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(200).json([]); // Return empty array if no cart or items
    }

    return res.status(200).json(cart.items);
  } catch (error) {
    console.error("GET CART ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update cart item quantity (increase or decrease)
exports.updateCartItemQuantity = async (req, res) => {
  try {
    // 🔒 Approval check
    if (req.user.role === 'Customer' && !req.user.isApproved) {
      return res.status(403).json({ message: "Account not approved by admin" });
    }

    const { cartItemId } = req.params;
    const { action } = req.body;

    if (!["increase", "decrease"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === cartItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (action === "increase") {
      cart.items[itemIndex].quantity += 1;
    } else if (action === "decrease") {
      cart.items[itemIndex].quantity -= 1;

      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
    }

    await cart.save();

    return res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("UPDATE CART ITEM ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
  try {
    // 🔒 Approval check
    if (req.user.role === 'Customer' && !req.user.isApproved) {
      return res.status(403).json({ message: "Account not approved by admin" });
    }

    const { cartItemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === cartItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    return res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("REMOVE FROM CART ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
