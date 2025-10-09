const pool = require("../database/");

/* Add an item to the wishlist */
async function addToWishlist(account_id, inv_id) {
  try {
    const sql = "INSERT INTO wishlist (account_id, inv_id) VALUES ($1, $2)";
    await pool.query(sql, [account_id, inv_id]);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
}

/* Get wishlist items for a specific user */
async function getWishlistByUser(account_id) {
  try {
    const sql = `
      SELECT w.wishlist_id, i.inv_make, i.inv_model, i.inv_price
      FROM wishlist w
      JOIN inventory i ON w.inv_id = i.inv_id
      WHERE w.account_id = $1
      ORDER BY w.added_at DESC`;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    console.error("Error retrieving wishlist:", error);
    throw error;
  }
}

/* Remove an item from the wishlist */
async function removeFromWishlist(wishlist_id) {
  try {
    const sql = "DELETE FROM wishlist WHERE wishlist_id = $1";
    await pool.query(sql, [wishlist_id]);
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
}

module.exports = { addToWishlist, getWishlistByUser, removeFromWishlist };
