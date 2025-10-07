// accountRoute.js

// Required modules
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/") 
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to deliver login view
router.get(
  "/login", 
  utilities.handleErrors(accountController.buildLogin)
)

// Register route
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Default route for account management view
router.get(
  "/",
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Update account view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process account info update
router.post(
  "/update-info",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccountInfo)
)

// Process password update
router.post(
  "/update-password",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updatePassword)
)



// Export the router
module.exports = router
