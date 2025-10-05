// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/") 


// Route to build inventory by classification view
//router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// 🚗 NEW route for vehicle details
//router.get("/detail/:inv_id", invController.buildByInvId)
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId))


// Inventory Management View
router.get("/", 
  utilities.handleErrors(invController.buildManagementView)
)

// Add Classification View
router.get("/add-classification", 
  utilities.handleErrors(invController.buildAddClassification)
)

// Process Add Classification
router.post("/add-classification", 
  utilities.handleErrors(invController.addClassification)
)

// ===============================
// Add Vehicle Routes
// ===============================

// Show the Add Vehicle form
router.get(
  "/add-vehicle",
  utilities.handleErrors(invController.buildAddVehicle)
)

// Process Add Vehicle form submission
router.post(
  "/add-vehicle",
  utilities.handleErrors(invController.addVehicle)
)

router.get("/getInventory/:classificationId", utilities.handleErrors(invController.getInventoryJSON))

// Route to deliver the edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);





module.exports = router;
