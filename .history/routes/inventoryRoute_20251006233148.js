// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// ===============================
// Public Routes (Visible to All Visitors)
// ===============================

// View vehicles by classification
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// View individual vehicle details
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInvId)
)


// ===============================
// Protected Routes (Employee / Admin only)
// ===============================

// Inventory Management View
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
)

// Add Classification View
router.get(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
)

// Process Add Classification
router.post(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.addClassification)
)

// Add Vehicle View
router.get(
  "/add-vehicle",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddVehicle)
)

// Process Add Vehicle
router.post(
  "/add-vehicle",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.addVehicle)
)

// JSON inventory list (optional - secure if needed)
router.get(
  "/getInventory/:classificationId",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
)

// Edit Vehicle View
router.get(
  "/edit/:inv_id",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
)

// Process Vehicle Update
router.post(
  "/update/",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.updateInventory)
)

// Delete Confirmation View
router.get(
  "/delete/:inv_id",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteView)
)

// Process Delete Vehicle
router.post(
  "/delete/",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router
