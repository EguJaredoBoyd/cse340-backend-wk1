const wishlistModel = require("../models/wishlist-model");
const utilities = require("../utilities/");

async function buildWishlistView(req, res, next) {
  const nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const wishlist = await wishlistModel.getWishlistByUser(account_id);

  res.render("wishlist/index", {
    title: "My Wishlist",
    nav,
    wishlist,
    errors: null,
  });
}

async function addToWishlist(req, res, next) {
  const { inv_id } = req.body;
  const account_id = res.locals.accountData.account_id;
  try {
    await wishlistModel.addToWishlist(account_id, inv_id);
    req.flash("notice", "Item added to wishlist!");
  } catch {
    req.flash("notice", "Error adding item to wishlist.");
  }
  res.redirect("/wishlist");
}

async function removeFromWishlist(req, res, next) {
  const { wishlist_id } = req.body;
  try {
    await wishlistModel.removeFromWishlist(wishlist_id);
    req.flash("notice", "Item removed from wishlist!");
  } catch {
    req.flash("notice", "Error removing item.");
  }
  res.redirect("/wishlist");
}

module.exports = { buildWishlistView, addToWishlist, removeFromWishlist };
