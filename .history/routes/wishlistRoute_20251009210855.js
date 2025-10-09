const express = require("express");
const router = new express.Router();
const wishlistController = require("../controllers/wishlistController");
const utilities = require("../utilities/");

// Protect all routes with login check
router.get("/", utilities.checkLogin, wishlistController.buildWishlistView);
router.post("/add", utilities.checkLogin, wishlistController.addToWishlist);
router.post("/remove", utilities.checkLogin, wishlistController.removeFromWishlist);

module.exports = router;
