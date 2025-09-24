// accountRoute.js

// Required modules
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/") 
const accountController = require("../controllers/accountController")

// Route to deliver login view
router.get(
  "/login", 
  utilities.handleErrors(accountController.buildLogin)
)

// Register route
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to process registration
router.post("/register", utilities.handleErrors(accountController.registerAccount))

// Export the router
module.exports = router
