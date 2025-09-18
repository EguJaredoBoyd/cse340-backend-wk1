// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// 🚗 NEW route for vehicle details
router.get("/detail/:inv_id", inventoryController.buildByInvId)

module.exports = router;
