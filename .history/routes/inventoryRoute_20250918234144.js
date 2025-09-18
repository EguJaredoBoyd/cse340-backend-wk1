// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")


// Route to build inventory by classification view
//router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// 🚗 NEW route for vehicle details
//router.get("/detail/:inv_id", invController.buildByInvId)
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId))

module.exports = router;
