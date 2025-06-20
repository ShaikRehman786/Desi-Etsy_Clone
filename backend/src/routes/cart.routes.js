const express = require("express");
const router = express.Router();
const cartCtrl = require("../controllers/cart.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// Add product to cart
router.post("/add/:productId", protect, restrictTo("Customer"), cartCtrl.addToCart);

// Get cart items for logged-in user
router.get("/", protect, restrictTo("Customer"), cartCtrl.getCart);

// Update cart item quantity (increase or decrease)
router.patch(
  "/update/:cartItemId",
  protect,
  restrictTo("Customer"),
  cartCtrl.updateCartItemQuantity
);



// Remove item from cart
router.delete(
  "/remove/:cartItemId",
  protect,
  restrictTo("Customer"),
  cartCtrl.removeFromCart
);





module.exports = router;
